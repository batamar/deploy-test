"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExpiringCards = exports.webhook = exports.updateSubscription = exports.createSubscription = exports.routes = void 0;
const stripe_1 = __importDefault(require("stripe"));
const User_1 = __importDefault(require("./models/User"));
const utils_1 = require("./utils");
const EmailTemplate_1 = __importDefault(require("./models/EmailTemplate"));
const aws_ses_1 = __importDefault(require("./aws-ses"));
const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, STRIPE_WEBHOOK_KEY, FROM_EMAIL_ADDRESS, ADMIN_EMAIL_ADDRESS } = process.env;
const stripe = new stripe_1.default(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const routes = ({ server }) => {
    server.get('/payment-info', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireAdmin)(req, res, next);
        const { cardDetails } = req.query;
        const adminUser = await User_1.default.findOne({ _id: req.user._id });
        const response = {
            paymentMethodId: Boolean(adminUser.stripePaymentMethodId),
        };
        if (cardDetails && adminUser.stripePaymentMethodId) {
            const paymentMethod = await stripe.paymentMethods.retrieve(adminUser.stripePaymentMethodId);
            response.cardDetails = paymentMethod.card;
        }
        return res.json(response);
    }));
    server.post('/save-payment-method', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireAdmin)(req, res, next);
        const { paymentMethod } = req.body;
        const paymentMethodId = paymentMethod.id;
        const adminUser = await User_1.default.findOne({ _id: req.user._id });
        let stripeCustomerId = adminUser.stripeCustomerId;
        if (!stripeCustomerId) {
            const stripeCustomer = await stripe.customers.create({ email: adminUser.email });
            stripeCustomerId = stripeCustomer.id;
        }
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerId,
        });
        await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        if (adminUser.stripePaymentMethodId) {
            await stripe.paymentMethods.detach(adminUser.stripePaymentMethodId);
        }
        await User_1.default.updateOne({ _id: adminUser._id }, {
            $set: {
                stripePaymentMethodId: paymentMethodId,
                stripeCustomerId,
            }
        });
        return res.json({
            paymentMethodId,
        });
    }));
};
exports.routes = routes;
const createSubscription = async (adminUser) => {
    const usersCount = await User_1.default.countDocuments({ organizationId: adminUser.organizationId });
    const subscription = await stripe.subscriptions.create({
        customer: adminUser.stripeCustomerId,
        items: [{
                price: STRIPE_PRICE_ID,
                quantity: usersCount - 1,
            }],
        proration_behavior: 'create_prorations',
    });
    return subscription;
};
exports.createSubscription = createSubscription;
const updateSubscription = async (adminUser) => {
    const subscriptionId = adminUser.stripeSubscriptionId;
    const usersCount = await User_1.default.countDocuments({ organizationId: adminUser.organizationId });
    const numberOfUsers = usersCount - 1;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await stripe.subscriptions.update(subscriptionId, {
        items: [{
                id: subscription.items.data[0].id,
                quantity: numberOfUsers,
            }],
    });
};
exports.updateSubscription = updateSubscription;
const webhook = async (req, res, _next) => {
    const sig = req.headers['stripe-signature'];
    let rawData = '';
    req.on('data', (chunk) => {
        rawData += chunk;
    });
    req.on('end', async () => {
        let event;
        try {
            event = stripe.webhooks.constructEvent(rawData, sig, STRIPE_WEBHOOK_KEY);
        }
        catch (error) {
            console.error('Webhook signature verification failed.', error.message);
            return res.sendStatus(400);
        }
        if (['invoice.payment_succeeded', 'payment_intent.payment_failed'].includes(event.type)) {
            const stripeCustomerId = event.data.object.customer;
            const customer = await User_1.default.findOne({ stripeCustomerId });
            if (!customer) {
                return res.sendStatus(200);
            }
        }
        switch (event.type) {
            case 'invoice.payment_succeeded':
                const invoiceSucceeded = event.data.object;
                const stripeCustomerId = event.data.object.customer;
                const user = await User_1.default.findOne({ stripeCustomerId });
                const template = await (0, EmailTemplate_1.default)('payment-success', {
                    amount: invoiceSucceeded.amount_paid / 100,
                    invoiceUrl: invoiceSucceeded.invoice_pdf,
                });
                if (user) {
                    await (0, aws_ses_1.default)({
                        from: `From <${FROM_EMAIL_ADDRESS}>`,
                        to: [user.email],
                        cc: [ADMIN_EMAIL_ADDRESS],
                        subject: template.subject,
                        body: template.message,
                    });
                }
                break;
            case 'payment_intent.payment_failed':
                const paymentIntentPaymentFailed = event.data.object;
                const customerEmail = paymentIntentPaymentFailed.charges.data[0].billing_details.email;
                if (customerEmail) {
                    const templateCustomer = await (0, EmailTemplate_1.default)('payment-failed-notification', {
                        reason: '',
                    });
                    await (0, aws_ses_1.default)({
                        from: `From <${FROM_EMAIL_ADDRESS}>`,
                        to: [customerEmail],
                        cc: [ADMIN_EMAIL_ADDRESS],
                        subject: templateCustomer.subject,
                        body: templateCustomer.message,
                    });
                }
                break;
            default:
                console.log('Unhandled event type:', event.type);
        }
        res.sendStatus(200);
    });
};
exports.webhook = webhook;
const checkExpiringCards = async () => {
    const users = await User_1.default.find({ stripeCustomerId: { $exists: true } });
    for (const user of users) {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card',
        });
        for (const paymentMethod of paymentMethods.data) {
            const { exp_month, exp_year } = paymentMethod.card;
            const currentDate = new Date();
            const expDate = new Date(exp_year, exp_month - 1);
            const oneMonthBeforeExp = new Date(expDate);
            oneMonthBeforeExp.setMonth(oneMonthBeforeExp.getMonth() - 1);
            if (currentDate >= oneMonthBeforeExp && currentDate < expDate) {
                const templateCustomer = await (0, EmailTemplate_1.default)('payment-card-expiration-notification', {
                    exp_month,
                    exp_year,
                });
                await (0, aws_ses_1.default)({
                    from: `From <${FROM_EMAIL_ADDRESS}>`,
                    to: [user.email],
                    cc: [ADMIN_EMAIL_ADDRESS],
                    subject: templateCustomer.subject,
                    body: templateCustomer.message,
                });
            }
        }
    }
};
exports.checkExpiringCards = checkExpiringCards;
