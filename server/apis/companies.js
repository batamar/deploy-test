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
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const _ = __importStar(require("lodash"));
const Company_1 = __importDefault(require("../models/Company"));
const Job_1 = __importDefault(require("../models/Job"));
const utils_1 = require("../utils");
const extractLogoFromWebsite = async (url) => {
    let logoUrl = '';
    try {
        const response = await axios_1.default.get(url);
        const html = response.data;
        const $ = cheerio_1.default.load(html);
        logoUrl = $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href') ||
            $('link[rel="apple-touch-icon"]').attr('href') ||
            $('link[rel="apple-touch-icon-precomposed"]').attr('href');
        if (!logoUrl) {
            logoUrl = $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content') ||
                $('img[alt*="logo"]').attr('src');
        }
        if (logoUrl && !logoUrl.startsWith('http')) {
            const baseUrl = new URL(url).origin;
            logoUrl = `${baseUrl}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
        }
    }
    catch (error) {
        logoUrl = '';
    }
    return logoUrl;
};
function default_1({ server }) {
    server.get('/companies', (0, utils_1.routeErrorHandling)(async (req, res) => {
        const { search, source, page = 1 } = req.query;
        const pageNumber = parseInt(page, 10);
        const selector = {
            isArchived: { $ne: true },
            $text: { $search: search || '' },
        };
        if (source === 'list' && !search) {
            delete selector.$text;
        }
        const limit = 10;
        const companies = await Company_1.default
            .find(selector)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limit)
            .limit(limit * 1)
            .lean();
        const totalCount = await Company_1.default.countDocuments(selector);
        return res.json({ list: companies, totalCount });
    }));
    server.post('/companies/create-or-update', async (req, res, next) => {
        await (0, utils_1.requireCompany)(req, res, next);
        const { _id, name, logo, status, notes, address, websiteUrl, companyEmailAddress, attachments } = req.body;
        const doc = {
            atsCompanyId: req.user.companyId,
            name,
            logo,
            status,
            notes,
            address,
            websiteUrl,
            companyEmailAddress,
            attachments
        };
        if (!logo) {
            doc.logo = await extractLogoFromWebsite(websiteUrl);
        }
        let response;
        if (_id) {
            const prevValue = await Company_1.default.findOne({ _id });
            if (!prevValue || prevValue.atsCompanyId !== req.user.companyId) {
                throw new Error('Permission denied');
            }
            response = await Company_1.default.updateOne({ _id }, { $set: doc });
        }
        else {
            response = await Company_1.default.create(Object.assign({ createdAt: new Date(), companySlug: _.kebabCase(name) }, doc));
        }
        return res.json(response);
    });
    server.get('/companies/detail', async (req, res, next) => {
        await (0, utils_1.requireCompany)(req, res, next);
        const { _id } = req.query;
        const company = await Company_1.default.findOne({ _id }).lean();
        return res.json(company);
    });
    server.post('/companies/update-field', async (req, res, next) => {
        await (0, utils_1.requireCompany)(req, res, next);
        const { companyId, type, fieldName, value } = req.body;
        const company = await Company_1.default.findOne({ _id: companyId });
        let modifier;
        if (type === 'update-simple-field') {
            modifier = { [fieldName]: value };
        }
        if (type === 'add-attachment') {
            modifier = {
                attachments: [...(company.attachments || []), value]
            };
        }
        if (type === 'remove-attachment') {
            modifier.attachments = (company.attachments || []).filter(item => item.url !== value.url);
        }
        if (modifier) {
            const response = await Company_1.default.updateOne({ _id: companyId }, { $set: modifier });
            return res.json(response);
        }
        return res.json({ message: 'done' });
    });
    server.get('/companies/jobs', async (req, res, next) => {
        await (0, utils_1.requireCompany)(req, res, next);
        const { companyId } = req.query;
        const jobs = await Job_1.default.find({ companyId }).lean();
        return res.json(jobs);
    });
}
exports.default = default_1;
