"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joinRequestsTypes_1 = __importDefault(require("./joinRequestsTypes"));
const util_1 = require("../../util");
class JoinRequest {
    constructor(ID, userID, projectID, message = "", accepted = false, rejected = false, rejectionMessage = "", acceptionMessage = "", timestamp = Date.now()) {
        this.ID = ID || util_1.hashFunction(userID + projectID);
        this.userID = userID;
        this.projectID = projectID;
        this.message = message;
        this.accepted = accepted;
        this.rejected = rejected;
        this.rejectionMessage = rejectionMessage;
        this.acceptionMessage = acceptionMessage;
        this.timestamp = timestamp;
    }
    isOnHold() {
        return (typeof this.accepted == typeof undefined) || (typeof this.rejected == typeof undefined);
    }
    isAccepted() {
        return this.accepted === true;
    }
    isRejected() {
        return this.rejected === false;
    }
    serializeAsJSON() {
        let obj = {};
        Object.keys(this).forEach((key) => {
            if (typeof this[key] != typeof undefined)
                obj[key] = this[key];
        });
        return obj;
    }
    isUserJoinRequest() {
        return this.type === joinRequestsTypes_1.default.UserJoinRequest;
    }
    isProjectJoinRequest() {
        return this.type === joinRequestsTypes_1.default.ProjectJoinRequest;
    }
}
exports.default = JoinRequest;
//# sourceMappingURL=joinRequest.js.map