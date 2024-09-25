"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dns_1 = __importDefault(require("dns"));
const ec2 = new aws_sdk_1.default.EC2({ region: 'us-east-1' });
const elb = new aws_sdk_1.default.ELBv2({ region: 'us-east-1' });
const route53 = new aws_sdk_1.default.Route53({ region: 'us-east-1' });
const ssm = new aws_sdk_1.default.SSM({ region: 'us-east-1' });
const HOSTED_ZONE_ID = 'Z3AADJGX6KTTL2';
const DOMAIN = 'example.com';
const VPC_ID = 'vpc-xxxxxxxx';
const SUBNET_IDS = ['subnet-xxxxxxxx', 'subnet-yyyyyyyy'];
const SECURITY_GROUP_ID = 'sg-xxxxxxxx';
async function provisionAndDeploy(organizationData) {
    try {
        const { id: orgId, subdomain } = organizationData;
        const instanceId = await createEC2Instance(orgId);
        return;
        const { loadBalancerArn, loadBalancerDNS, targetGroupArn } = await createLoadBalancer(orgId, VPC_ID, SUBNET_IDS);
        await registerTarget(targetGroupArn, instanceId);
        await waitForInstanceHealthy(targetGroupArn, instanceId);
        await deployUsingSSM(instanceId);
        const fullSubdomain = `${subdomain}.${DOMAIN}`;
        await createAliasRecord(fullSubdomain, loadBalancerDNS);
        await verifyDNS(fullSubdomain, loadBalancerDNS);
        console.log(`Deployment completed for organization ${orgId}`);
    }
    catch (error) {
        console.error('Error in provisioning and deploying:', error);
    }
}
async function createEC2Instance(orgId) {
    const params = {
        ImageId: 'ami-0abcdef1234567890',
        InstanceType: 't2.micro',
        KeyName: 'your-key-pair',
        MinCount: 1,
        MaxCount: 1,
        TagSpecifications: [
            {
                ResourceType: 'instance',
                Tags: [
                    { Key: 'Organization', Value: orgId },
                    { Key: 'Purpose', Value: 'NextjsDeployment' },
                ],
            },
        ],
        UserData: Buffer.from(`
        #!/bin/bash
        exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

        # Update and install packages
        sudo yum update -y
        curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
        sudo yum install -y nodejs git

        # Install PM2
        sudo npm install -g pm2

        # Clone the repository
        git clone https://github.com/your-repo/your-nextjs-app.git /home/ec2-user/your-nextjs-app

        # Set permissions
        sudo chown -R ec2-user:ec2-user /home/ec2-user/your-nextjs-app

        # Navigate to the app directory
        cd /home/ec2-user/your-nextjs-app

        # Install dependencies
        npm install

        # Build the application
        npm run build

        # Start the application with PM2
        pm2 start npm --name "nextjs-app" -- start

        # Save PM2 process list
        pm2 save

        # Ensure PM2 starts on boot
        pm2 startup systemd -u ec2-user --hp /home/ec2-user
    `).toString('base64'),
    };
    const data = await ec2.runInstances(params).promise();
    const instanceId = data.Instances[0].InstanceId;
    console.log(`EC2 Instance created with ID: ${instanceId}`);
    return instanceId;
}
async function createLoadBalancer(orgId, vpcId, subnetIds) {
    const targetGroupParams = {
        Name: `tg-${orgId}`,
        Protocol: 'HTTP',
        Port: 80,
        VpcId: vpcId,
        HealthCheckProtocol: 'HTTP',
        HealthCheckPort: '80',
        HealthCheckPath: '/',
        HealthCheckIntervalSeconds: 30,
        HealthCheckTimeoutSeconds: 5,
        HealthyThresholdCount: 5,
        UnhealthyThresholdCount: 2,
        Matcher: {
            HttpCode: '200-299',
        },
    };
    const targetGroupData = await elb.createTargetGroup(targetGroupParams).promise();
    const targetGroupArn = targetGroupData.TargetGroups[0].TargetGroupArn;
    console.log(`Target Group created with ARN: ${targetGroupArn}`);
    const lbParams = {
        Name: `lb-${orgId}`,
        Subnets: subnetIds,
        SecurityGroups: [SECURITY_GROUP_ID],
        Scheme: 'internet-facing',
        Type: 'application',
        IpAddressType: 'ipv4',
    };
    const lbData = await elb.createLoadBalancer(lbParams).promise();
    const loadBalancerArn = lbData.LoadBalancers[0].LoadBalancerArn;
    const loadBalancerDNS = lbData.LoadBalancers[0].DNSName;
    console.log(`Load Balancer created with ARN: ${loadBalancerArn} and DNS: ${loadBalancerDNS}`);
    const listenerParams = {
        LoadBalancerArn: loadBalancerArn,
        Protocol: 'HTTP',
        Port: 80,
        DefaultActions: [
            {
                Type: 'forward',
                TargetGroupArn: targetGroupArn,
            },
        ],
    };
    const listenerData = await elb.createListener(listenerParams).promise();
    console.log(`Listener created for Load Balancer: ${loadBalancerArn}`);
    return { loadBalancerArn, loadBalancerDNS, targetGroupArn };
}
async function registerTarget(targetGroupArn, instanceId) {
    const params = {
        TargetGroupArn: targetGroupArn,
        Targets: [
            {
                Id: instanceId,
                Port: 80,
            },
        ],
    };
    await elb.registerTargets(params).promise();
    console.log(`Instance ${instanceId} registered with Target Group ${targetGroupArn}`);
}
async function waitForInstanceHealthy(targetGroupArn, instanceId) {
    console.log(`Waiting for instance ${instanceId} to become healthy...`);
    const maxRetries = 20;
    const delay = 15000;
    for (let i = 0; i < maxRetries; i++) {
        const healthData = await elb.describeTargetHealth({ TargetGroupArn: targetGroupArn, Targets: [{ Id: instanceId }] }).promise();
        const targetHealth = healthData.TargetHealthDescriptions[0].TargetHealth.State;
        console.log(`Current health state: ${targetHealth}`);
        if (targetHealth === 'healthy') {
            console.log(`Instance ${instanceId} is healthy.`);
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    throw new Error(`Instance ${instanceId} did not become healthy within expected time.`);
}
async function deployUsingSSM(instanceId) {
    const commands = [
        'cd /home/ec2-user/your-nextjs-app',
        'git pull origin main',
        'npm install',
        'npm run build',
        'pm2 restart nextjs-app',
        'pm2 save',
    ];
    const params = {
        InstanceIds: [instanceId],
        DocumentName: 'AWS-RunShellScript',
        Parameters: { commands },
    };
    const response = await ssm.sendCommand(params).promise();
    const commandId = response.Command.CommandId;
    console.log(`SSM Command sent with ID: ${commandId}`);
}
async function createAliasRecord(subdomain, loadBalancerDNS) {
    const lbData = await elb.describeLoadBalancers({ DNSName: loadBalancerDNS }).promise();
    const loadBalancer = lbData.LoadBalancers[0];
    const hostedZoneId = loadBalancer.CanonicalHostedZoneId;
    const dnsName = loadBalancer.DNSName;
    const recordParams = {
        HostedZoneId: HOSTED_ZONE_ID,
        ChangeBatch: {
            Comment: 'Create Alias Record for new organization',
            Changes: [
                {
                    Action: 'CREATE',
                    ResourceRecordSet: {
                        Name: subdomain,
                        Type: 'A',
                        AliasTarget: {
                            HostedZoneId: hostedZoneId,
                            DNSName: dnsName,
                            EvaluateTargetHealth: true,
                        },
                    },
                },
            ],
        },
    };
    await route53.changeResourceRecordSets(recordParams).promise();
    console.log(`Alias record created for ${subdomain} pointing to ELB ${dnsName}`);
}
async function verifyDNS(subdomain, loadBalancerDNS) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 30000));
        const addresses = await dns_1.default.promises.resolve(subdomain, 'A');
        console.log(`DNS A records for ${subdomain}:`, addresses);
        const cnameRecords = await dns_1.default.promises.resolveCname(subdomain);
        console.log(`CNAME records for ${subdomain}:`, cnameRecords);
        if (cnameRecords.includes(loadBalancerDNS)) {
            console.log(`DNS verification successful for ${subdomain}`);
        }
        else {
            console.warn(`DNS verification failed for ${subdomain}. Expected CNAME to include ${loadBalancerDNS}`);
        }
    }
    catch (error) {
        console.error(`DNS verification failed for ${subdomain}:`, error);
    }
}
const organizationData = { id: 'org123', subdomain: 'org123' };
provisionAndDeploy(organizationData);
