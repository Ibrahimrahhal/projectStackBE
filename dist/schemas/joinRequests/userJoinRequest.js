"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joinRequest_1 = __importDefault(require("./joinRequest"));
class UserJoinRequest extends joinRequest_1.default {
    constructor() {
        super(...arguments);
        this.type = 2;
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
    }
}
exports.default = UserJoinRequest;
//# sourceMappingURL=userJoinRequest.js.map