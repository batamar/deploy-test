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
exports.allowedOrigins = exports.enrichCandidate = exports.fetchRocketReach = exports.fetchContactOut = exports.replacePlaceHolders = exports.endTimer = exports.startTimer = exports.getActivityLogs = exports.createActivityLog = exports.requireSuperAdmin = exports.requireAdmin = exports.requireLogin = exports.requireExtensionLogin = exports.routeErrorHandling = exports.extractPdf = exports.commonSelector = void 0;
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const perf_hooks_1 = require("perf_hooks");
const dotenv = __importStar(require("dotenv"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const aws_s3_1 = require("./aws-s3");
const Job_1 = __importDefault(require("./models/Job"));
const LinkedInProfiles_1 = __importDefault(require("./models/LinkedInProfiles"));
const User_1 = __importDefault(require("./models/User"));
const ActivityLog_1 = require("./models/ActivityLog");
const Candidates_1 = __importDefault(require("./models/Candidates"));
const constants_1 = require("./constants");
dotenv.config();
const commonSelector = (user) => {
    return { organizationId: user.organizationId };
};
exports.commonSelector = commonSelector;
const pdfParseLib = async (url) => {
    const objKey = url.includes('amazonaws.com') ? url.split('amazonaws.com/')[1] : url;
    const dataBuffer = await (0, aws_s3_1.getObject)(objKey);
    const content = await new Promise((resolve, reject) => {
        (0, pdf_parse_1.default)(dataBuffer, { max: 3 })
            .then(function (data) {
            resolve(data.text);
        }).
            catch((e) => {
            reject(e);
        });
    });
    return content;
};
const extractPdf = async (url) => {
    const content = await pdfParseLib(url);
    return {
        wholeContent: content,
        truncatedContent: content.slice(0, 11000)
    };
};
exports.extractPdf = extractPdf;
const routeErrorHandling = (fn, callback) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (e) {
            console.error(e);
            if (callback) {
                return callback(res, e, next);
            }
            return next(e);
        }
    };
};
exports.routeErrorHandling = routeErrorHandling;
const requireExtensionLogin = async (req, _res, _next) => {
    if (!req.extensionUser) {
        throw new Error('Unauthorized');
    }
};
exports.requireExtensionLogin = requireExtensionLogin;
const requireLogin = async (req, _res, _next) => {
    if (!req.user) {
        throw new Error('Login required');
    }
};
exports.requireLogin = requireLogin;
const requireAdmin = async (req, res, next) => {
    await (0, exports.requireLogin)(req, res, next);
    if (!['superAdmin', 'admin', 'systemAdmin'].includes(req.user.role)) {
        throw new Error('Permission denied');
    }
};
exports.requireAdmin = requireAdmin;
const requireSuperAdmin = async (req, res, next) => {
    await (0, exports.requireAdmin)(req, res, next);
    if (req.user.role !== 'superAdmin') {
        throw new Error('Permission denied');
    }
};
exports.requireSuperAdmin = requireSuperAdmin;
const createActivityLog = async ({ type, userId, jobId, candidateId, data }) => {
    let jobTitle = '';
    let candidateName = '';
    if (jobId) {
        const job = await Job_1.default.findOne({ _id: jobId });
        if (job) {
            jobTitle = job.title;
        }
    }
    if (candidateId) {
        const candidata = await Candidates_1.default.findOne({ _id: candidateId });
        if (candidata) {
            candidateName = `${candidata.firstName} ${candidata.lastName}`;
        }
    }
    if (data && data.statusId) {
        const status = await ActivityLog_1.CandidateStatus.findOne({ _id: data.statusId });
        if (status) {
            data.statusName = status.name;
            data.statusColor = status.color;
        }
    }
    await ActivityLog_1.ActivityLog.create({
        createdAt: new Date(),
        createdUserId: userId,
        type,
        jobId,
        jobTitle,
        candidateId,
        candidateName,
        data
    });
    return { statusData: data };
};
exports.createActivityLog = createActivityLog;
const getActivityLogs = async (selector) => {
    const logs = await ActivityLog_1.ActivityLog.find(selector).sort({ createdAt: -1 }).lean();
    const users = await User_1.default.find({}, { _id: 1, avatarUrl: 1, firstName: 1, lastName: 1 }).lean();
    const usersMap = {};
    for (const user of users) {
        usersMap[user._id] = user;
    }
    for (const log of logs) {
        if (log.createdUserId) {
            log.user = usersMap[log.createdUserId];
        }
    }
    return logs;
};
exports.getActivityLogs = getActivityLogs;
let timers = {};
const startTimer = (user, blockName) => {
    if (!user.isAdmin) {
        return;
    }
    const userId = user._id.toString();
    if (!timers[userId]) {
        timers[userId] = {};
    }
    timers[userId][blockName] = perf_hooks_1.performance.now();
};
exports.startTimer = startTimer;
const endTimer = (user, blockName) => {
    if (!user.isAdmin) {
        return;
    }
    const userId = user._id.toString();
    if (!timers[userId] || !timers[userId][blockName]) {
        console.error(`Timer for "${blockName}" was not started.`);
        return null;
    }
    const startTime = timers[userId][blockName];
    const endTime = perf_hooks_1.performance.now();
    const elapsedTime = endTime - startTime;
    delete timers[userId][blockName];
    return elapsedTime / 1000;
};
exports.endTimer = endTimer;
const replacePlaceHolders = ({ text, candidate, job, client }) => {
    let replacedText = text;
    if (!text) {
        return text;
    }
    const replacers = [
        {
            type: 'candidate',
            object: candidate,
            fields: constants_1.candidateFields
        },
        {
            type: 'job',
            object: job,
            fields: constants_1.jobFields
        },
        {
            type: 'client',
            object: client,
            fields: constants_1.clientFields
        }
    ];
    for (const replacer of replacers) {
        const object = replacer.object;
        if (object) {
            for (const field of replacer.fields) {
                let value = object[field.value] || '';
                if (value && ['createdAt', 'updatedAt'].includes(field.value)) {
                    value = (0, moment_1.default)(value).format('MM/DD/YYYY');
                }
                if (replacer.type === 'client' && field.value === 'address') {
                    const address = object.address;
                    if (address) {
                        value = `${address.street}, ${address.city}, ${address.state}`;
                    }
                }
                replacedText = replacedText.replace(new RegExp(`%${replacer.type.toUpperCase()}_${field.value.toUpperCase()}%`, 'g'), value);
            }
        }
    }
    return replacedText;
};
exports.replacePlaceHolders = replacePlaceHolders;
const handleAxiosError = (error) => {
    if (error.response) {
        console.log('Error Response:', error.response.data);
        console.log('Status Code:', error.response.status);
    }
    else if (error.request) {
        console.log('No Response:', error.request);
    }
    else {
        console.log('Axios Error:', error.message);
    }
};
const fetchContactOut = async (candidate) => {
    let response;
    try {
        response = await axios_1.default.get(`https://api.contactout.com/v1/linkedin/enrich?profile=${candidate.linkedinUrl}`, {
            headers: {
                'authorization': 'basic',
                'token': process.env.CONTACTOUT_API_KEY,
            }
        });
    }
    catch (e) {
        console.log(`Error fetching contact out for ${candidate.linkedinUrl}`);
        handleAxiosError(e);
        return [];
    }
    let emails = candidate.emails || [];
    const addEmails = (newEmails) => {
        for (const newEmail of newEmails) {
            if (emails.some(e => e.email === newEmail.email)) {
                continue;
            }
            emails.push(newEmail);
        }
    };
    const profile = response.data.profile;
    if (profile.work_email) {
        addEmails((profile.work_email || []).map(email => ({ email, type: 'work' })));
    }
    if (profile.personal_email) {
        addEmails((profile.personal_email || []).map(email => ({ email, type: 'personal' })));
    }
    if (profile.email) {
        addEmails((profile.email || []).map(email => ({ email, type: 'other' })));
    }
    if (emails) {
        candidate.emails = emails;
        await candidate.save();
    }
    const prevValue = await LinkedInProfiles_1.default.findOne({ linkedinUrl: candidate.linkedinUrl });
    if (!prevValue) {
        await LinkedInProfiles_1.default.create({
            linkedinUrl: candidate.linkedinUrl,
            emails,
            contactOutDoc: response.data
        });
    }
    return emails;
};
exports.fetchContactOut = fetchContactOut;
const fetchRocketReach = async (candidate) => {
    let response;
    try {
        response = await axios_1.default.get(` https://api.rocketreach.co/api/v2/person/lookup?linkedin_url=${candidate.linkedinUrl}`, {
            headers: {
                'Api-Key': process.env.ROCKETREACH_API_KEY
            }
        });
    }
    catch (e) {
        console.log(`Error fetching rocket reach for ${candidate.linkedinUrl}`);
        handleAxiosError(e);
        return [];
    }
    const profile = response.data;
    const emails = (profile.emails || [])
        .filter(email => email.smtp_valid === 'valid')
        .map(email => ({
        email: email.email,
        type: email.type === 'professional' ? 'work' : email.type
    }));
    if (emails) {
        for (const candidateEmail of candidate.emails || []) {
            if (emails.some(e => e.email === candidateEmail.email)) {
                continue;
            }
            emails.push(candidateEmail);
        }
        candidate.emails = emails;
        await candidate.save();
    }
    const prevValue = await LinkedInProfiles_1.default.findOne({ linkedinUrl: candidate.linkedinUrl });
    if (!prevValue) {
        await LinkedInProfiles_1.default.create({
            linkedinUrl: candidate.linkedinUrl,
            emails,
            rocketReachDoc: profile
        });
    }
    return emails;
};
exports.fetchRocketReach = fetchRocketReach;
const enrichCandidate = async (candidate) => {
    const profile = await LinkedInProfiles_1.default.findOne({ linkedinUrl: candidate.linkedinUrl });
    if (profile && profile.emails && profile.emails.length > 0) {
        candidate.emails = profile.emails;
        await candidate.save();
    }
    else {
        const emails = await (0, exports.fetchContactOut)(candidate);
        if (emails.length === 0) {
            await (0, exports.fetchRocketReach)(candidate);
        }
    }
};
exports.enrichCandidate = enrichCandidate;
const allowedOrigins = (origin, callback) => {
    const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';
    if (ALLOWED_ORIGINS === '*') {
        return callback(null, true);
    }
    if (!origin || ALLOWED_ORIGINS.split(',').some(element => origin.includes(element))) {
        callback(null, true);
    }
    else {
        callback(new Error('Not allowed by CORS'));
    }
};
exports.allowedOrigins = allowedOrigins;
