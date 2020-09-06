"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = __importDefault(require("./notification"));
class ProjectJoinRequestNotification extends notification_1.default {
    constructor(ID, projectID, userID, RequestID, read = false) {
        super(ID, userID, read);
        this.Type = 2;
        this.projectID = projectID;
        this.RequestID = RequestID;
    }
}
exports.default = ProjectJoinRequestNotification;
//# sourceMappingURL=projectJoinRequestNotification.js.map