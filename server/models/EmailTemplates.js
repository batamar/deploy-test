"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtsEmailTemplateSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class AtsEmailTemplateClass extends mongoose_1.default.Model {
}
exports.AtsEmailTemplateSchema = new mongoose_1.default.Schema({
    atsCompanyId: { type: String, required: true },
    name: { type: String, required: true },
    regardingJobId: { type: String },
    receipients: { type: String },
    subject: { type: String },
    body: { type: String },
    attachments: { type: [Object] },
    createdAt: { type: Date },
    updatedAt: { type: Date },
});
exports.AtsEmailTemplateSchema.loadClass(AtsEmailTemplateClass);
const AtsEmailTemplates = mongoose_1.default.model('ats_email_templates', exports.AtsEmailTemplateSchema);
exports.default = AtsEmailTemplates;
