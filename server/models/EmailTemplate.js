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
exports.insertTemplates = exports.EmailTemplate = void 0;
const _ = __importStar(require("lodash"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const EmailTemplate = mongoose_1.default.model('EmailTemplate', new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}));
exports.EmailTemplate = EmailTemplate;
async function insertTemplates() {
    const templates = [
        {
            name: 'payment-success',
            subject: 'WIB: successful payment',
            message: `
        We are pleased to confirm the successful payment of $<%= amount %>. <a href="<%= invoiceUrl %>">Click here to see the invoice</a>
      `,
        },
        {
            name: 'payment-failed-notification',
            subject: 'WIB: failed payment',
            message: `
        Your recent payment for featured item at the app.workinbiotech.com has failed.
        Please review your payment details and try again.
      `,
        },
        {
            name: 'payment-card-expiration-notification',
            subject: 'WIB: card expiration notification',
            message: `
        Your card will expire on <%= exp_month %>/<%= exp_year %>. Please update your card details to avoid any interruption in service.
      `,
        },
        {
            name: 'after-apply-applicant',
            subject: 'Thanks for applying to <%= jobTitle %>!',
            message: `
      <%= name %>,

      Thank you for submitting your application to <%= jobTitle %> at <%= organizationName %>. The team at <%= companyName %> will review your resume and reach out to you if they are interested.

      <p>
        Best of luck!
        Talent Tracker Team
      </p>
      `,
        },
        {
            name: 'after-apply-recruiter',
            subject: 'New application for <%= jobTitle %>',
            message: `
      <%= name %> has applied to your job posting for <%= jobTitle %>. See the attached resume.
      `,
        },
    ];
    for (const t of templates) {
        const et = await EmailTemplate.findOne({ name: t.name });
        const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();
        if (!et) {
            await EmailTemplate.create(Object.assign({}, t, { message }));
        }
        else if (et.subject !== t.subject || et.message !== message) {
            await EmailTemplate.updateOne({ _id: et._id }, { $set: { message, subject: t.subject } }).exec();
        }
    }
}
exports.insertTemplates = insertTemplates;
async function getEmailTemplate(name, params, template) {
    await insertTemplates();
    const source = template || (await EmailTemplate.findOne({ name }).setOptions({ lean: true }));
    if (!source) {
        throw new Error('Email Template is not found.');
    }
    console.log(params);
    return {
        message: _.template(source.message)(params),
        subject: _.template(source.subject)(params),
    };
}
exports.default = getEmailTemplate;
