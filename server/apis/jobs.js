"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const Job_1 = __importDefault(require("../models/Job"));
const User_1 = __importDefault(require("../models/User"));
const Candidates_1 = __importDefault(require("../models/Candidates"));
const Summaries_1 = __importDefault(require("../models/Summaries"));
const ActivityLog_1 = require("../models/ActivityLog");
const Clients_1 = __importDefault(require("../models/Clients"));
const utils_1 = require("../utils");
const llm_1 = require("../llm");
function default_1({ server }) {
    server.post('/jobs/manage', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = req.user;
        const { _id, action, clientId, title, status, location, locationType, description, notes, minSalary, maxSalary, recruiterId, } = req.body;
        if (action === 'delete') {
            const candidateIds = await Candidates_1.default.find({ jobIds: { $in: _id } }, { _id: 1 }).lean();
            if (candidateIds.length > 0) {
                throw new Error('Cannot delete job with candidates');
            }
            return res.json(await Job_1.default.deleteOne({ _id }));
        }
        const client = await Clients_1.default.findOne({ _id: clientId });
        if (!title) {
            throw new Error('Title is required');
        }
        if (!client) {
            throw new Error('Client not found');
        }
        const doc = {
            organizationId: user.organizationId,
            clientId,
            clientName: client.name,
            clientLogo: client.logo,
            createdAt: new Date(),
            title,
            status,
            location,
            locationType,
            description,
            notes,
            estimatedSalary: {
                minValue: minSalary,
                maxValue: maxSalary
            },
            recruiterId,
        };
        let response;
        if (_id) {
            const prevValue = await Job_1.default.findOne({ _id });
            if (!prevValue || prevValue.organizationId !== req.user.organizationId) {
                throw new Error('Permission denied');
            }
            if (prevValue.description !== description) {
                doc.descriptionSummary = await (0, llm_1.summarizeJobDescription)(description);
            }
            response = await Job_1.default.updateOne({ _id }, { $set: Object.assign(Object.assign({}, doc), { updatedAt: new Date() }) });
        }
        else {
            response = await Job_1.default.create(Object.assign(Object.assign({ status: 'draft', createdAt: new Date() }, doc), { descriptionSummary: await (0, llm_1.summarizeJobDescription)(doc.description) }));
            await (0, utils_1.createActivityLog)({
                type: 'jobCreated',
                userId: user._id,
                jobId: response._id,
            });
        }
        return res.json(response);
    }));
    server.get('/jobs/detail', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id } = req.query;
        const job = await Job_1.default.findOne({ _id }).lean();
        job.recruiter = await User_1.default.findOne({ _id: job.recruiterId }).lean();
        return res.json(job);
    }));
    server.post('/jobs/delete', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id } = req.body;
        const job = await Job_1.default.findOne({ _id });
        if (!job || job.organizationId !== req.user.organizationId) {
            throw new Error('Permission denied');
        }
        return res.json(await Job_1.default.deleteOne({ _id }));
    }));
    server.get('/jobs/get-list', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = req.user;
        const { page = 1, status, search } = req.query;
        const pageNumber = parseInt(page, 10);
        const limit = 10;
        const selector = { organizationId: user.organizationId };
        if (status && status !== 'undefined') {
            selector.status = status;
        }
        if (search) {
            const regex = new RegExp(search, 'gi');
            selector.title = { $regex: regex };
        }
        const jobs = await Job_1.default.find(selector)
            .skip((pageNumber - 1) * limit)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .lean();
        return res.json({ list: jobs, totalCount: await Job_1.default.countDocuments(selector) });
    }));
    server.get('/jobs/candidates', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { jobId } = req.query;
        const job = await Job_1.default.findOne({ _id: jobId }).lean();
        const candidates = await Candidates_1.default.find({ jobIds: { $in: job._id } }, { firstName: 1, lastName: 1, updatedAt: 1, city: 1, state: 1 }).lean();
        const candidateIds = candidates.map(c => c._id);
        const response = [];
        const activityLogs = await ActivityLog_1.ActivityLog.find({
            jobId: job._id,
            candidateId: { $in: candidateIds },
            type: 'candidateStatusChanged'
        }, { candidateId: 1, data: 1 }).sort({ createdAt: -1 }).lean();
        const statuses = await ActivityLog_1.CandidateStatus.find({}).lean();
        const summaries = await Summaries_1.default.find({ applicantId: { $in: candidateIds } }, { applicantId: 1, ratingResponseText: 1, responseText: 1 }).lean();
        for (const candidate of candidates) {
            const activityLog = activityLogs.find(log => log.candidateId === candidate._id.toString());
            let status = {};
            if (activityLog && activityLog.data) {
                const statusEntry = statuses.find(s => s._id.toString() === activityLog.data.statusId);
                status = Object.assign(Object.assign({}, activityLog.data), (statusEntry ? {
                    color: statusEntry.color,
                    name: statusEntry.name,
                } : {}));
            }
            const summary = summaries.find(s => s.applicantId === candidate._id.toString());
            response.push(Object.assign(Object.assign({}, candidate), { status, summary }));
        }
        return res.json(response);
    }));
    server.get('/jobs/get-activity-logs', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { jobId } = req.query;
        const logs = await (0, utils_1.getActivityLogs)({ jobId });
        return res.json(logs);
    }));
    server.post('/jobs/update-field', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { jobId, type, fieldName, value } = req.body;
        let modifier;
        if (type === 'update-simple-field') {
            modifier = { [fieldName]: value };
            if (fieldName === 'clientId') {
                const client = await Clients_1.default.findOne({ _id: value });
                modifier.clientName = client.name;
            }
        }
        if (modifier) {
            const response = await Job_1.default.updateOne({ _id: jobId }, { $set: modifier });
            return res.json(response);
        }
        return res.json({ message: 'done' });
    }));
    server.post('/jobs/get-observer-link', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireAdmin)(req, res, next);
        const { _id } = req.body;
        const job = await Job_1.default.findOne({ _id });
        if (job.observerLink) {
            return res.json({ organizationId: job.organizationId, observerLink: job.observerLink });
        }
        const observerLink = crypto_1.default.randomBytes(32).toString('hex');
        await Job_1.default.updateOne({ _id }, { $set: { observerLink } });
        return res.json({ organizationId: job.organizationId, observerLink });
    }));
}
exports.default = default_1;
