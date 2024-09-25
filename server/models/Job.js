"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.JobSchema = new mongoose_1.default.Schema({
    organizationId: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    descriptionSummary: {
        type: String,
    },
    notes: {
        type: String,
    },
    htmlDescription: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    },
    clientName: {
        type: String,
    },
    clientLogo: {
        type: String,
    },
    clientId: {
        type: String,
        required: true,
    },
    estimatedSalary: {
        minValue: String,
        maxValue: String,
    },
    recruiterId: {
        type: String,
    },
    customBulletPoints: { type: [Object] },
    observerLink: { type: String },
});
class JobClass extends mongoose_1.default.Model {
}
exports.JobSchema.loadClass(JobClass);
const Job = mongoose_1.default.model('jobs', exports.JobSchema);
exports.default = Job;
