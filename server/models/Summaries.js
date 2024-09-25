"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarieschema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class summaryClass extends mongoose_1.default.Model {
    static async createSummary(doc) {
        return this.create(Object.assign({ createdAt: new Date() }, doc));
    }
}
exports.summarieschema = new mongoose_1.default.Schema({
    userId: { type: String },
    createdAt: { type: Date },
    jobId: { type: String },
    applicantId: { type: String },
    wholeContent: { type: String },
    truncatedContent: { type: String },
    inputPrompt: { type: Object },
    responseText: { type: String },
    llmResponseJSON: { type: Object },
    ratingInputPrompt: { type: Object },
    ratingResponseText: { type: String },
    llmRatingResponseJSON: { type: Object },
    s3Url: { type: String },
    error: { type: String },
    status: { type: String },
    costInCents: { type: Number },
    isRead: { type: Boolean },
});
exports.summarieschema.loadClass(summaryClass);
const summary = mongoose_1.default.model('summaries', exports.summarieschema);
exports.default = summary;
