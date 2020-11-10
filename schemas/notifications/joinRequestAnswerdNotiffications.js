"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notifcationsEnums_1 = __importDefault(require("./notifcationsEnums"));
const notification_1 = __importDefault(require("./notification"));
class JoinRequestAnsweredNotification extends notification_1.default {
    constructor(ID, userID, RequestID, read = false, timestamp) {
        super(ID, userID, read, timestamp);
        this.type = notifcationsEnums_1.default.JoinRequestAnsweredNotification;
        this.requestID = RequestID;
    }
}
exports.default = JoinRequestAnsweredNotification;
//# sourceMappingURL=joinRequestAnswerdNotiffications.js.map