"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class EventClass extends mongoose_1.default.Model {
}
exports.EventSchema = new mongoose_1.default.Schema({
    userId: { type: String },
    title: { type: String },
    googleEventId: { type: String },
    startDateTime: { type: String },
    endDateTime: { type: String },
    isAllDay: { type: Boolean },
    participants: { type: [Object] },
});
exports.EventSchema.loadClass(EventClass);
const Events = mongoose_1.default.model('events', exports.EventSchema);
exports.default = Events;
