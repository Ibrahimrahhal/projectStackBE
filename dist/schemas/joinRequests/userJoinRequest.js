"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joinRequest_1 = __importDefault(require("./joinRequest"));
class UserJoinRequest extends joinRequest_1.default {
    constructor(ID, userID, projectID, message = "", accepted = false, rejected = false, rejectionMessage = "", acceptionMessage = "", timestamp = Date.now(), actionDoneBy) {
        super(ID, userID, projectID, message, accepted, rejected, rejectionMessage, acceptionMessage, timestamp);
        this.markAsAccepted = (UserIDThatAccepted, message) => {
            this.accepted = true;
            this.actionDoneBy = UserIDThatAccepted;
            this.acceptionMessage = message;
        };
        this.markAsRejected = (UserIDThatRejected, message) => {
            this.rejected = true;
            this.actionDoneBy = UserIDThatRejected;
            this.rejectionMessage = message;
        };
        this.actionDoneBy = actionDoneBy;
    }
}
exports.default = UserJoinRequest;
//# sourceMappingURL=userJoinRequest.js.map