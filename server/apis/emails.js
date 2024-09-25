"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Job_1 = __importDefault(require("../models/Job"));
const Clients_1 = __importDefault(require("../models/Clients"));
const Candidates_1 = __importDefault(require("../models/Candidates"));
const AtsEmailTemplates_1 = __importDefault(require("../models/AtsEmailTemplates"));
const utils_2 = require("../utils");
const aws_ses_1 = __importDefault(require("../aws-ses"));
const { FROM_EMAIL_ADDRESS } = process.env;
function default_1({ server }) {
    server.post('/email-templates/manage', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireAdmin)(req, res, next);
        const user = req.user;
        const { action, _id, regardingJobId, receipients, subject, body, attachments, name } = req.body;
        const doc = {
            organizationId: user.organizationId,
            name,
            regardingJobId,
            receipients,
            subject,
            body,
            attachments
        };
        let response;
        if (action === 'remove') {
            response = await AtsEmailTemplates_1.default.deleteOne({ _id });
        }
        else {
            if (_id) {
                response = await AtsEmailTemplates_1.default.updateOne({ _id }, { $set: doc });
            }
            else {
                response = await AtsEmailTemplates_1.default.create(Object.assign({ createdAt: new Date() }, doc));
            }
        }
        return res.json(response);
    }));
    server.get('/email-templates/list', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const templates = await AtsEmailTemplates_1.default.find((0, utils_2.commonSelector)(req.user)).lean();
        return res.json({ list: templates });
    }));
    server.post('/emails/send', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { regardingJobId, receipients, subject, body, attachments, candidateId } = req.body;
        let job;
        let client;
        let candidate;
        if (regardingJobId) {
            job = await Job_1.default.findOne({ _id: regardingJobId });
            client = await Clients_1.default.findOne({ _id: job.clientId });
        }
        if (candidateId) {
            candidate = await Candidates_1.default.findOne({ _id: candidateId });
        }
        const response = await (0, aws_ses_1.default)({
            from: FROM_EMAIL_ADDRESS,
            to: receipients ? (0, utils_2.replacePlaceHolders)({ text: receipients, candidate, job, client }).split(',') : [],
            subject: (0, utils_2.replacePlaceHolders)({ text: subject, candidate, job, client }),
            body: (0, utils_2.replacePlaceHolders)({ text: body, job, client, candidate }),
            attachments: attachments ? attachments.map(attachment => attachment.url) : [],
            replyTo: client && client.companyEmailAddress ? [client.companyEmailAddress] : [],
        });
        await (0, utils_1.createActivityLog)({
            type: 'emailSent',
            userId: req.user._id,
            jobId: regardingJobId,
            candidateId,
            data: {
                receipients,
                subject,
                body,
                attachments
            }
        });
        return res.json(response);
    }));
}
exports.default = default_1;
