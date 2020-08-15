"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = __importDefault(require("./notification"));
class UserJoinRequestToRelatedProjectNotification extends notification_1.default {
    constructor(ID, projectID, senderProjectID, userID, JoinRequest) {
        super(ID);
        this.Type = 1;
        this.projectID = projectID;
        this.senderUserID = senderProjectID;
        this.receiverUserID = userID;
        this.JoinRequest = JoinRequest;
    }
}
exports.default = UserJoinRequestToRelatedProjectNotification;
module.exports = UserJoinRequestToRelatedProjectNotification;
//# sourceMappingURL=userJoinRequestToRelatedProjectNotification.js.map