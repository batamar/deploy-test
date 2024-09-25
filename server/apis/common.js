"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const User_1 = __importDefault(require("../models/User"));
const Organizations_1 = __importDefault(require("../models/Organizations"));
const Prompts_1 = require("../models/Prompts");
const llm_1 = require("../llm");
const payment_1 = require("../payment");
function default_1({ server }) {
    server.get('/organization', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const organizationId = req.user.organizationId;
        const organization = await Organizations_1.default.findById(organizationId).lean();
        return res.json(organization);
    }));
    server.post('/organization', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireSuperAdmin)(req, res, next);
        const { name, website, subdomain, logo } = req.body;
        const prevValue = await Organizations_1.default.findById(req.user.organizationId).lean();
        if (prevValue.subdomain && !subdomain) {
            throw new Error('Subdomain is required');
        }
        await Organizations_1.default.updateOne({ _id: req.user.organizationId }, { $set: { name, website, subdomain, logo } });
        return res.json({ success: true });
    }));
    server.post('/organization/check-subdomain', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { subdomain } = req.body;
        const exists = await Organizations_1.default.findOne({ $and: [{ subdomain }, { _id: { $ne: req.user.organizationId } }] });
        return res.json(!exists);
    }));
    server.get('/users', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const users = await User_1.default.find({ organizationId: req.user.organizationId }).lean();
        return res.json(users);
    }));
    server.get('/users/me', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = await User_1.default.findById(req.user._id).lean();
        if (!user.timezone) {
            user.timezone = Intl.DateTimeFormat().resolvedOptions().locale;
        }
        return res.json(user);
    }));
    server.post('/users/me', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const { firstName, lastName, avatarUrl, email, phone, timezone, password, confirmPassword } = req.body;
        const user = await User_1.default.findById(req.user._id).lean();
        if (password && !await User_1.default.comparePassword(password, user.password)) {
            throw new Error('Password is incorrect');
        }
        if (password && confirmPassword && password !== confirmPassword) {
            throw new Error('Password and confirmation do not match');
        }
        await User_1.default.updateOne({ _id: req.user._id }, { $set: { firstName, lastName, avatarUrl, email, phone, timezone } });
        return res.json({ success: true });
    }));
    server.post('/users/manage', (0, utils_1.routeErrorHandling)(async (req, res, next) => {
        await (0, utils_1.requireAdmin)(req, res, next);
        const user = req.user;
        const adminUser = await User_1.default.findById(req.user._id).lean();
        const { action, _id, firstName, lastName, title, email, phone, password, passwordConfirm, role } = req.body;
        const doc = {
            organizationId: req.user.organizationId,
            firstName,
            lastName,
            title,
            email,
            phone,
            role
        };
        let response;
        if (action === 'remove') {
            response = await User_1.default.deleteOne({ _id });
        }
        else {
            if (_id) {
                response = await User_1.default.updateOne({ _id }, { $set: doc });
            }
            else {
                response = await User_1.default.createUser(Object.assign({ organizationId: user.organizationId, password, passwordConfirmation: passwordConfirm, email }, doc));
            }
        }
        if (!_id || action === 'remove') {
            if (adminUser.stripeSubscriptionId) {
                await (0, payment_1.updateSubscription)(adminUser);
            }
            else {
                const stripeSubscription = await (0, payment_1.createSubscription)(adminUser);
                await User_1.default.updateOne({ _id: adminUser._id }, { $set: { stripeSubscriptionId: stripeSubscription.id } });
            }
        }
        return res.json(response);
    }));
    server.post('/activity-logs/create-note', async (req, res, next) => {
        await (0, utils_1.requireLogin)(req, res, next);
        const user = req.user;
        const { jobId, candidateId, note } = req.body;
        const response = await (0, utils_1.createActivityLog)({
            type: 'noteCreated',
            jobId,
            candidateId,
            userId: user._id,
            data: {
                note
            }
        });
        return res.json(response);
    });
    server.post('/ai-editor/modify', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { tool, text } = req.body;
        return res.json({ text: await (0, llm_1.aiAssistantModifyText)(tool, text) });
    }));
    server.post('/ai-editor/analyze-content', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { content } = req.body;
        return res.json({ text: await (0, llm_1.aiAssistantAnalyzeContent)(content) });
    }));
    server.get('/prompts', (0, utils_1.routeErrorHandling)(async (req, res) => {
        if (!req.user || req.user.role !== 'systemAdmin') {
            return res.json([]);
        }
        const prompts = await Prompts_1.Prompts.find({}).lean();
        return res.json(prompts);
    }));
    server.post('/prompts/manage', (0, utils_1.routeErrorHandling)(async (req, res) => {
        if (!req.user || req.user.role !== 'systemAdmin') {
            throw new Error('Permission denied');
        }
        const { action, _id, name, system, user } = req.body;
        const doc = {
            name,
            system,
            user,
        };
        let response;
        if (action === 'remove') {
            response = await Prompts_1.Prompts.deleteOne({ _id });
        }
        else {
            if (_id) {
                response = await Prompts_1.Prompts.updateOne({ _id }, { $set: doc });
            }
            else {
                response = await Prompts_1.Prompts.create(Object.assign({}, doc));
            }
        }
        return res.json(response);
    }));
}
exports.default = default_1;
