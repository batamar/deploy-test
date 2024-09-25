"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedInProfileSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class LinkedInProfileClass extends mongoose_1.default.Model {
}
exports.LinkedInProfileSchema = new mongoose_1.default.Schema({
    linkedinUrl: { type: String },
    emails: { type: [Object] },
    contactOutDoc: { type: mongoose_1.default.Schema.Types.Mixed },
    rocketReachDoc: { type: mongoose_1.default.Schema.Types.Mixed },
});
exports.LinkedInProfileSchema.loadClass(LinkedInProfileClass);
const LinkedInProfiles = mongoose_1.default.model('linkedin_profiles', exports.LinkedInProfileSchema);
exports.default = LinkedInProfiles;
