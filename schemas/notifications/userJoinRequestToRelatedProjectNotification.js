"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notifcationsEnums_1 = __importDefault(require("./notifcationsEnums"));
const notification_1 = __importDefault(require("./notification"));
class UserJoinRequestToRelatedProjectNotification extends notification_1.default {
    constructor(ID, projectID, userID, JoinRequestID, read = false, timestamp) {
        super(ID, userID, read, timestamp);
        this.type = notifcationsEnums_1.default.UserJoinRequestToRelatedProjectNotification;
        this.projectID = projectID;
        this.requestID = JoinRequestID;
    }
}
exports.default = UserJoinRequestToRelatedProjectNotification;
//# sourceMappingURL=userJoinRequestToRelatedProjectNotification.js.map