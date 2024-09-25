"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Job_1 = __importDefault(require("../models/Job"));
const Candidates_1 = __importDefault(require("../models/Candidates"));
const ActivityLog_1 = require("../models/ActivityLog");
const candidates_1 = require("./candidates");
function default_1({ server }) {
    server.post('/extension/find-jobs', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireExtensionLogin)(req, res, next);
        const user = req.extensionUser;
        const { search } = req.body;
        const jobs = await Job_1.default.find({ organizationId: user.organizationId, title: { $regex: new RegExp(search, 'i') } }).limit(10).lean();
        return res.json(jobs);
    }));
    server.post('/extension/get-candidate', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireExtensionLogin)(req, res, next);
        const user = req.extensionUser;
        const { linkedinUrl } = req.body;
        const candidate = await Candidates_1.default.findOne({ organizationId: user.organizationId, linkedinUrl }).lean();
        if (candidate) {
            candidate.jobs = await Job_1.default.find({ _id: { $in: candidate.jobIds } }, { _id: 1, title: 1 }).lean();
            candidate.statuses = await ActivityLog_1.CandidateStatus.find({ organizationId: user.organizationId }).lean();
            return res.json(candidate);
        }
        return res.json(null);
    }));
    server.post('/extension/add-candidate', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireExtensionLogin)(req, res, next);
        const user = req.extensionUser;
        const { firstName, lastName, title, location, email, linkedinUrl, resumes, website, avatarUrl, jobId, workHistories, currentCompany, notes } = req.body;
        const prev = await Candidates_1.default.findOne({ linkedinUrl });
        if (prev) {
            return res.status(401).json({ error: 'Candidate already exists' });
        }
        const job = await Job_1.default.findOne({ _id: jobId });
        if (!job) {
            return res.status(401).json({ error: 'Job not found' });
        }
        const candidate = await (0, candidates_1.getOrCreateCandidate)({ params: {
                jobIds: [job._id],
                linkedinUrl,
                firstName,
                lastName,
                avatarUrl,
                emails: email ? [{ email, type: 'other' }] : [],
                resumes: resumes.map(r => ({
                    url: r.url.replace(`https://${process.env.AWS_BUCKET}.s3.amazonaws.com/`, ''),
                    name: r.url.replace(`https://${process.env.AWS_BUCKET}.s3.amazonaws.com/`, ''),
                    date: r.date,
                })),
                title,
                currentLocation: location,
                websiteUrl: website,
                currentCompany,
                notes,
                workHistories: (workHistories || []).map(wh => ({
                    title: wh.title,
                    employer: wh.employer,
                    startDateMonth: wh.startDateMonth,
                    startDateYear: wh.startDateYear,
                    endDateMonth: wh.endDateMonth,
                    endDateYear: wh.endDateYear,
                    isCurrent: !wh.endDateMonth,
                }))
            }, organizationId: user.organizationId, createdUserId: user._id });
        (0, utils_1.enrichCandidate)(candidate).then(() => {
            console.log('enriched candidate');
        }).catch(err => {
            console.log('error enriching candidate', err);
        });
        return res.json(candidate);
    }));
    server.get('/extension/get-candidate-status-by-job', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireExtensionLogin)(req, res, next);
        const { jobId, candidateId } = req.query;
        const logs = await ActivityLog_1.ActivityLog.find({ type: 'candidateStatusChanged', jobId, candidateId: candidateId }).sort({ createdAt: -1 }).limit(1);
        const recentStatus = logs[0] ? logs[0].data : null;
        return res.json(recentStatus);
    }));
    server.post('/extension/change-candidate-status', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireExtensionLogin)(req, res, next);
        const { jobId, candidateId, statusId, note } = req.body;
        const response = await (0, candidates_1.changeJobStatus)({ user: req.extensionUser, jobId, candidateId, statusId, note });
        return res.json(response.statusData);
    }));
}
exports.default = default_1;
