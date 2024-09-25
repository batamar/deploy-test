"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Candidates_1 = __importDefault(require("../models/Candidates"));
const Job_1 = __importDefault(require("../models/Job"));
const User_1 = __importDefault(require("../models/User"));
const EmailTemplate_1 = __importDefault(require("../models/EmailTemplate"));
const aws_ses_1 = __importDefault(require("../aws-ses"));
const Organizations_1 = __importDefault(require("../models/Organizations"));
const utils_1 = require("../utils");
const candidates_1 = require("./candidates");
const { NOREPLY_EMAIL_ADDRESS } = process.env;
function default_1({ server }) {
    server.get('/portal/organization-detail', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { _id } = req.query;
        const organization = await Organizations_1.default.findOne({ _id }).lean();
        return res.json(organization);
    }));
    server.get('/portal/jobs', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { organizationId } = req.query;
        const jobs = await Job_1.default.find({ organizationId, status: 'active' }, { _id: 1, title: 1, location: 1, createdAt: 1 })
            .limit(100)
            .sort({ createdAt: -1 })
            .lean();
        return res.json(jobs);
    }));
    server.get('/portal/job-detail', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { jobId } = req.query;
        const job = await Job_1.default.findOne({ _id: jobId }).lean();
        return res.json(job);
    }));
    server.post('/portal/jobs/apply/check-existance', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { jobId, email } = req.body;
        const applicant = await Candidates_1.default.findOne({ jobIds: { $in: [jobId] }, 'emails.email': { $in: [email] } }, { _id: 1 });
        return res.json(applicant ? true : false);
    }));
    server.post('/portal/jobs/apply', async (req, res) => {
        const { jobId, jobTitle, resume, fullName, email, phone, currentLocation, currentCompany, linkedinUrl, websiteUrl, } = req.body;
        const prevValue = await Candidates_1.default.findOne({ jobIds: { $in: [jobId] }, 'emails.email': { $in: [email] } });
        if (prevValue) {
            throw new Error('Already submitted');
        }
        const job = await Job_1.default.findOne({ _id: jobId });
        if (!job) {
            throw new Error('Job not found');
        }
        const organization = await Organizations_1.default.findOne({ _id: job.organizationId });
        const organizationId = job.organizationId;
        const template = await (0, EmailTemplate_1.default)('after-apply-applicant', {
            jobTitle,
            organizationName: organization.name,
            name: fullName,
        });
        await (0, aws_ses_1.default)({
            from: `From <${NOREPLY_EMAIL_ADDRESS}>`,
            to: [email],
            subject: template.subject,
            body: template.message,
        });
        const recruiter = await User_1.default.findOne({ _id: job.recruiterId });
        if (recruiter) {
            const templateRecruiter = await (0, EmailTemplate_1.default)('after-apply-recruiter', {
                jobTitle,
                name: fullName,
            });
            await (0, aws_ses_1.default)({
                from: `From <${NOREPLY_EMAIL_ADDRESS}>`,
                to: [recruiter.email],
                subject: templateRecruiter.subject,
                body: templateRecruiter.message,
                attachments: resume ? [resume] : [],
            });
        }
        const [firstName, lastName] = fullName.split(' ');
        const [city, state] = currentLocation.split(',');
        const candidate = await (0, candidates_1.getOrCreateCandidate)({ params: {
                jobIds: [job._id],
                linkedinUrl,
                firstName,
                lastName,
                emails: email ? [{ email, type: 'other' }] : [],
                phones: phone ? [{ phone, type: 'other' }] : [],
                resumes: [{ url: resume, name: resume, date: new Date() }],
                title: jobTitle,
                city,
                state,
                websiteUrl,
                currentCompany,
            }, organizationId });
        return res.json(candidate);
    });
    server.get('/portal/observe/job', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { observerLink } = req.query;
        const job = await Job_1.default.findOne({ observerLink });
        const candidates = await Candidates_1.default.find({ jobIds: { $in: [job._id] } });
        return res.json({ job, candidates });
    }));
}
exports.default = default_1;
