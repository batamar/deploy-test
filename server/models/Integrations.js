"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class IntegrationClass extends mongoose_1.default.Model {
}
exports.IntegrationSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    isActive: { type: Boolean },
    credentials: { type: Object },
    data: { type: Object },
});
exports.IntegrationSchema.loadClass(IntegrationClass);
const Integrations = mongoose_1.default.model('integrations', exports.IntegrationSchema);
exports.default = Integrations;
