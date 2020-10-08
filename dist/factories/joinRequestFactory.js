"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joinRequestsTypes_1 = __importDefault(require("../schemas/joinRequests/joinRequestsTypes"));
const projectJoinRequest_1 = __importDefault(require("../schemas/joinRequests/projectJoinRequest"));
const factory_1 = __importDefault(require("./factory"));
const userJoinRequest_1 = __importDefault(require("../schemas/joinRequests/userJoinRequest"));
class JoinRequestsFactory extends factory_1.default {
    createItem(json) {
        const { type } = json;
        switch ((type || "").toString()) {
            case joinRequestsTypes_1.default.ProjectJoinRequest.toString():
                return this.CreateProjectJoinRequest(json);
            case joinRequestsTypes_1.default.UserJoinRequest.toString():
                return this.CreateUserJoinRequest(json);
        }
    }
    CreateProjectJoinRequest({ ID, userID, projectID, message, accepted, rejected, rejectionMessage, acceptionMessage, timestamp }) {
        let joinReq = new projectJoinRequest_1.default(ID, userID, projectID, message, accepted, rejected, rejectionMessage, acceptionMessage, timestamp);
        return joinReq;
    }
    CreateUserJoinRequest({ ID, userID, projectID, message, accepted, rejected, rejectionMessage, acceptionMessage, timestamp, actionDoneBy }) {
        let joinReq = new userJoinRequest_1.default(ID, userID, projectID, message, accepted, rejected, rejectionMessage, acceptionMessage, timestamp, actionDoneBy);
        return joinReq;
    }
}
exports.default = JoinRequestsFactory;
//# sourceMappingURL=joinRequestFactory.js.map