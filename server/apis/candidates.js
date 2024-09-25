"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCandidate = exports.changeJobStatus = void 0;
const llm_1 = require("../llm");
const Candidates_1 = __importStar(require("../models/Candidates"));
const ActivityLog_1 = require("../models/ActivityLog");
const Job_1 = __importDefault(require("../models/Job"));
const utils_1 = require("../utils");
const llm_2 = require("../llm");
const constants_1 = require("../constants");
const utils_2 = require("../utils");
const aws_ses_1 = __importDefault(require("../aws-ses"));
const Clients_1 = __importDefault(require("../models/Clients"));
const { FROM_EMAIL_ADDRESS } = process.env;
const changeJobStatus = async ({ user, jobId, candidateId, statusId, note }) => {
    const triggers = await Candidates_1.Trigger.find({ statusId }).lean();
    const job = await Job_1.default.findOne({ _id: jobId }).lean();
    const candidate = await Candidates_1.default.findOne({ _id: candidateId }).lean();
    const client = await Clients_1.default.findOne({ _id: job.clientId });
    for (const trigger of triggers) {
        const { bcc, subject, body } = trigger;
        await (0, aws_ses_1.default)({
            from: FROM_EMAIL_ADDRESS,
            to: bcc ? (0, utils_2.replacePlaceHolders)({ text: bcc, candidate, job, client }).split(',') : [],
            subject: (0, utils_2.replacePlaceHolders)({ text: subject, candidate, job, client }),
            body: (0, utils_2.replacePlaceHolders)({ text: body, candidate, job, client }),
            replyTo: client.companyEmailAddress ? [client.companyEmailAddress] : [],
        });
    }
    const response = await (0, utils_1.createActivityLog)({
        type: 'candidateStatusChanged',
        userId: user._id,
        jobId,
        candidateId,
        data: {
            statusId,
            note
        }
    });
    return response;
};
exports.changeJobStatus = changeJobStatus;
const getOrCreateCandidate = async ({ params, organizationId, createdUserId }) => {
    const { _id, firstName, lastName, emails, phones, currentCompany, linkedinUrl, githubUrl, googleScholarUrl, websiteUrl, city, state, notes, resumes, jobIds, workHistories, attachments } = params;
    let prevValue;
    if (_id) {
        prevValue = await Candidates_1.default.findOne({ _id });
    }
    const doc = {
        organizationId,
        jobIds,
        firstName,
        lastName,
        emails,
        phones,
        currentCompany,
        linkedinUrl,
        githubUrl,
        googleScholarUrl,
        websiteUrl,
        city,
        state,
        notes,
        resumes,
        attachments,
        workHistories,
    };
    let response;
    if (_id) {
        if (!prevValue || prevValue.organizationId !== organizationId) {
            throw new Error('Permission denied');
        }
        response = await Candidates_1.default.updateOne({ _id }, { $set: Object.assign({ updatedAt: new Date() }, doc) });
    }
    else {
        response = await Candidates_1.default.create(Object.assign({ status: 'draft', createdAt: new Date() }, doc));
        await (0, utils_1.createActivityLog)({
            type: 'candidateCreated',
            userId: createdUserId,
            candidateId: response._id,
        });
    }
    (0, llm_2.createResumeEmbedding)({ resumes, prevValue, candidateId: _id || response._id })
        .then(() => { console.log('Extracted resume embedding'); })
        .catch((err) => { console.log(`Error during resume embedding extraction ${err.message}`); });
    (0, llm_1.extractWorkHistory)(_id || response._id)
        .then(() => { console.log('Extracted work history'); })
        .catch((err) => { console.log(`Error during work histor extraction ${err.message}`); });
    return response;
};
exports.getOrCreateCandidate = getOrCreateCandidate;
function default_1({ server }) {
    server.post('/candidates/manage', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = req.user;
        const { _id, action, } = req.body;
        if (action === 'delete') {
            return res.json(await Candidates_1.default.deleteOne({ _id }));
        }
        const response = await (0, exports.getOrCreateCandidate)({ params: req.body, organizationId: user.organizationId, createdUserId: user._id });
        return res.json(response);
    }));
    server.post('/candidates/parse-cv', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { url } = req.body;
        const { wholeContent } = await (0, utils_1.extractPdf)(url);
        return res.json(await (0, llm_2.parseCV)(wholeContent));
    }));
    server.get('/candidates/detail', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id } = req.query;
        const candidate = await Candidates_1.default.findOne({ _id }).lean();
        candidate.attachments = [...(candidate.attachments || []), ...(candidate.resumes || []).map((resume) => {
                return Object.assign(Object.assign({}, resume), { isResume: true });
            })];
        return res.json(candidate);
    }));
    server.get('/candidates/jobs', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { candidateId } = req.query;
        const candidate = await Candidates_1.default.findOne({ _id: candidateId }).lean();
        const jobs = await Job_1.default.find({ _id: { $in: candidate.jobIds || [] } }).lean();
        const jobIds = jobs.map(j => j._id);
        const response = [];
        const activityLogs = await ActivityLog_1.ActivityLog.find({
            jobId: { $in: jobIds },
            candidateId: candidate._id,
            type: 'candidateStatusChanged'
        }, { jobId: 1, data: 1 }).sort({ createdAt: -1 }).lean();
        const statuses = await ActivityLog_1.CandidateStatus.find({}).lean();
        for (const job of jobs) {
            const activityLog = activityLogs.find(log => log.jobId === job._id.toString());
            let status = {};
            if (activityLog && activityLog.data) {
                const statusEntry = statuses.find(s => s._id.toString() === activityLog.data.statusId);
                status = Object.assign(Object.assign({}, activityLog.data), { color: statusEntry.color, name: statusEntry.name });
            }
            response.push(Object.assign(Object.assign({}, job), { status }));
        }
        return res.json(response);
    }));
    server.post('/candidates/delete', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id } = req.body;
        const candidate = await Candidates_1.default.findOne({ _id });
        if (!candidate || candidate.organizationId !== req.user.organizationId) {
            throw new Error('Permission denied');
        }
        return res.json(await Candidates_1.default.deleteOne({ _id }));
    }));
    server.get('/candidates', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = req.user;
        const { page = 1, search } = req.query;
        const pageNumber = parseInt(page, 10);
        const limit = 10;
        const selector = { organizationId: user.organizationId };
        if (search) {
            const regex = new RegExp(search.trim(), 'gi');
            selector.resumeContentWholeContent = { $regex: regex };
        }
        const candidates = await Candidates_1.default.find(selector, { resumeContent: 0, resumeContentForEmbedding: 0, resumeContentWholeContent: 0, resumeEmbedding: 0, resumeContentTruncatedContent: 0 })
            .skip((pageNumber - 1) * limit)
            .limit(limit * 1)
            .lean();
        const candidateIds = candidates.map(cand => cand._id);
        const logs = await ActivityLog_1.ActivityLog.find({ type: 'candidateStatusChanged', candidateId: { $in: candidateIds } });
        const logsMap = {};
        for (const log of logs) {
            if (!logsMap[log.candidateId]) {
                logsMap[log.candidateId] = log;
            }
            if (log.createdAt > logsMap[log.candidateId].createdAt) {
                logsMap[log.candidateId] = log;
            }
        }
        for (const candidate of candidates) {
            candidate.recentStatus = logsMap[candidate._id];
        }
        return res.json({ list: candidates, totalCount: await Candidates_1.default.countDocuments(selector) });
    }));
    server.get('/candidates/get-activity-logs', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { candidateId } = req.query;
        const logs = await (0, utils_1.getActivityLogs)({ candidateId });
        return res.json(logs);
    }));
    server.post('/candidates/update-field', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = req.user;
        const { candidateId, type, fieldName, value } = req.body;
        const candidate = await Candidates_1.default.findOne({ _id: candidateId });
        let modifier;
        if (type === 'remove-from-jobs-pipeline') {
            await Candidates_1.default.updateOne({ _id: candidateId }, { $set: {
                    jobIds: (candidate.jobIds || []).filter(ji => ji !== value)
                }
            });
            await (0, utils_1.createActivityLog)({
                type: 'candidateRemovedFromPipeline',
                userId: user._id,
                jobId: value,
                candidateId
            });
        }
        if (type === 'add-to-jobs-pipeline') {
            let jobIds = candidate.jobIds || [];
            jobIds = [...jobIds, ...value];
            await Candidates_1.default.updateOne({ _id: candidateId }, { $set: { jobIds } });
            for (const jobId of value) {
                await (0, utils_1.createActivityLog)({
                    type: 'candidateAddedToPipeline',
                    userId: user._id,
                    jobId,
                    candidateId
                });
            }
            for (const jobId of value) {
                const job = await Job_1.default.findOne({ _id: jobId });
                (0, llm_1.generateSummary)({
                    user,
                    job,
                    candidate
                }).then(() => {
                    console.log(`Done summarizing ${job.title}`);
                }).catch((err) => {
                    console.log(`Error during ${job.title} summarization ${err.message}`);
                });
            }
        }
        if (type === 'add-resume') {
            modifier = {
                resumes: [...(candidate.resumes || []), value]
            };
        }
        if (type === 'add-attachment') {
            modifier = {
                attachments: [...(candidate.attachments || []), value]
            };
        }
        if (type === 'remove-attachment') {
            let list = (value.isResume ? candidate.resumes : candidate.attachments) || [];
            list = list.filter(item => item.url !== value.url);
            modifier = {
                [value.isResume ? 'resumes' : 'attachments']: list
            };
        }
        if (type === 'remove-work-history') {
            let workHistories = candidate.workHistories || [];
            workHistories = workHistories.filter(wh => wh._id !== value);
            modifier = { workHistories };
        }
        if (type === 'update-simple-field') {
            modifier = { [fieldName]: value };
        }
        if (modifier) {
            const response = await Candidates_1.default.updateOne({ _id: candidateId }, { $set: modifier });
            return res.json(response);
        }
        return res.json({ message: 'done' });
    }));
    server.post('/candidates/create-or-update-work-history', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { candidateId, _id, title, employer, startDateMonth, startDateYear, endDateMonth, endDateYear, isCurrent, locationState, locationCity, supervisorName, supervisorPhone, isVerified, summary } = req.body;
        const candidate = await Candidates_1.default.findOne({ _id: candidateId });
        const workHistories = candidate.workHistories || [];
        const doc = {
            title,
            employer,
            startDateMonth,
            startDateYear,
            endDateMonth,
            endDateYear,
            isCurrent,
            locationState,
            locationCity,
            supervisorName,
            supervisorPhone,
            isVerified,
            summary
        };
        if (_id) {
            const index = workHistories.findIndex(h => h._id === _id);
            workHistories[index] = Object.assign({ _id }, doc);
        }
        else {
            workHistories.push(Object.assign({ _id: Math.random() }, doc));
        }
        const response = await Candidates_1.default.updateOne({ _id: candidateId }, { $set: { workHistories } });
        return res.json(response);
    }));
    server.post('/candidates/change-job-order-status', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = req.user;
        const { jobId, candidateId, statusId, note, } = req.body;
        const response = await (0, exports.changeJobStatus)({ user, jobId, candidateId, statusId, note });
        return res.json(response);
    }));
    server.post('/candidates/semantic-search', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id } = req.body;
        const job = await Job_1.default.findOne({ _id });
        if (!job || !job.descriptionSummary) {
            throw new Error('Job description summary not found');
        }
        const queryVector = await (0, llm_2.createEmbedding)(job.descriptionSummary);
        const candidates = await Candidates_1.default.aggregate([
            {
                "$vectorSearch": {
                    "queryVector": queryVector,
                    "path": "resumeEmbedding",
                    "numCandidates": 10000,
                    "limit": 10,
                    "index": "vector_index",
                }
            },
            {
                $project: {
                    resumeContentWholeContent: 0,
                    resumeContentTruncatedContent: 0,
                    resumeEmbedding: 0,
                    score: {
                        '$meta': 'vectorSearchScore'
                    }
                }
            },
            {
                $sort: {
                    score: -1
                }
            },
        ]);
        return res.json({ list: candidates, totalCount: candidates.length });
    }));
    server.get('/candidates/statuses', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const statuses = await ActivityLog_1.CandidateStatus.find({}).lean();
        const triggers = await Candidates_1.Trigger.find({}).lean();
        const triggersMap = {};
        for (const trigger of triggers) {
            triggersMap[trigger.statusId] = triggersMap[trigger.statusId] || [];
            triggersMap[trigger.statusId].push(trigger);
        }
        const list = [];
        for (const status of statuses) {
            list.push(Object.assign(Object.assign({}, status), { triggers: triggersMap[status._id] || [] }));
        }
        return res.json({ list });
    }));
    server.post('/candidates/statuses/manage', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id, name, color, action } = req.body;
        if (action === 'delete') {
            return res.json(await ActivityLog_1.CandidateStatus.deleteOne({ _id }));
        }
        const doc = {
            organizationId: req.user.organizationId,
            name,
            color,
        };
        let response;
        if (_id) {
            response = await ActivityLog_1.CandidateStatus.updateOne({ _id }, { $set: doc });
        }
        else {
            response = await ActivityLog_1.CandidateStatus.create(doc);
        }
        return res.json(response);
    }));
    server.post('/candidates/statuses/manage-triggers', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { _id, action, statusId, description, bcc, subject, body } = req.body;
        const doc = {
            statusId,
            description,
            bcc,
            subject,
            body
        };
        let response;
        if (action === 'delete') {
            response = await Candidates_1.Trigger.deleteOne({ _id });
        }
        else {
            if (_id) {
                response = await Candidates_1.Trigger.updateOne({ _id }, { $set: doc });
            }
            else {
                response = await Candidates_1.Trigger.create(doc);
            }
        }
        return res.json(response);
    }));
    server.get('/candidates/statuses/tags', (0, utils_1.routeErrorHandling)(async (_req, res) => {
        return res.json({ tags: constants_1.tags });
    }));
}
exports.default = default_1;
