"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatePromptSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class TemplatePromptClass extends mongoose_1.default.Model {
}
exports.TemplatePromptSchema = new mongoose_1.default.Schema({
    name: { type: String },
    promptText: { type: String },
    exampleResponse: { type: String },
    createdAt: { type: Date },
    userId: { type: String },
    editedAt: { type: Date },
    editedBy: { type: String },
    isPrebuilt: { type: Boolean },
});
exports.TemplatePromptSchema.loadClass(TemplatePromptClass);
const TemplatePrompts = mongoose_1.default.model('template_prompts', exports.TemplatePromptSchema);
exports.default = TemplatePrompts;
