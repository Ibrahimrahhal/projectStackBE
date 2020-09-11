"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JoinRequest {
    constructor(ID, userID, projectID, message = "", accepted = false, rejected = false, rejectionMessage = "", acceptionMessage = "", timestamp = Date.now()) {
        this.ID = ID;
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
        return this.type === exports.JoinRequestTypeEnum.UserJoinRequest;
    }
    isProjectJoinRequest() {
        return this.type === exports.JoinRequestTypeEnum.ProjectJoinRequest;
    }
}
exports.default = JoinRequest;
exports.JoinRequestTypeEnum = {
    ProjectJoinRequest: 1,
    UserJoinRequest: 2
};
//# sourceMappingURL=joinRequest.js.map