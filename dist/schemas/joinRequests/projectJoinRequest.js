"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joinRequest_1 = __importDefault(require("./joinRequest"));
class ProjectJoinRequest extends joinRequest_1.default {
    constructor() {
        super(...arguments);
        this.markAsAccepted = (message) => {
            this.accepted = true;
            this.acceptionMessage = message;
        };
        this.markAsRejected = (message) => {
            this.rejected = true;
            this.rejectionMessage = message;
        };
    }
}
exports.default = ProjectJoinRequest;
//# sourceMappingURL=projectJoinRequest.js.map