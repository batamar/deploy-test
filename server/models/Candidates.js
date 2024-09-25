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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trigger = void 0;
const mongoose = __importStar(require("mongoose"));
const CandidateSchema = new mongoose.Schema({
    organizationId: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    jobIds: { type: [String] },
    avatarUrl: { type: String },
    resumes: { type: [Object] },
    resumeContentTruncatedContent: { type: String },
    resumeContentWholeContent: { type: String, },
    workHistories: { type: [Object] },
    firstName: { type: String },
    lastName: { type: String },
    emails: { type: [Object] },
    phones: { type: [Object] },
    currentLocation: { type: String },
    currentCompany: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    googleScholarUrl: { type: String },
    websiteUrl: { type: String },
    city: { type: String },
    state: { type: String },
    notes: { type: String },
    attachments: { type: [Object] },
    customQuestionSubmissions: { type: Object },
    resumeContentForEmbedding: { type: String },
    resumeEmbedding: { type: [Number] },
});
const Candidate = mongoose.model('candidate', CandidateSchema);
CandidateSchema.index({ firstName: 'text', lastName: 'text', phones: 'text', emails: 'text', resumeContentForEmbedding: 'text', resumeContentWholeContent: 'text' });
exports.default = Candidate;
exports.Trigger = mongoose.model('trigger', new mongoose.Schema({
    statusId: { type: String },
    description: { type: String },
    bcc: { type: String },
    subject: { type: String },
    body: { type: String },
}));
