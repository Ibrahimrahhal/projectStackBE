"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const projectJoinRequestNotification_1 = __importDefault(require("../schemas/notifications/projectJoinRequestNotification"));
const joinRequestAnswerdNotiffications_1 = __importDefault(require("../schemas/notifications/joinRequestAnswerdNotiffications"));
const notifcationsEnums_1 = __importDefault(require("../schemas/notifications/notifcationsEnums"));
const userJoinRequestToRelatedProjectNotification_1 = __importDefault(require("../schemas/notifications/userJoinRequestToRelatedProjectNotification"));
const factory_1 = __importDefault(require("./factory"));
class NotificationsFactory extends factory_1.default {
    createItem(itemObject) {
        switch ((itemObject.type || "").toString()) {
            case notifcationsEnums_1.default.JoinRequestAnsweredNotification.toString():
                return new joinRequestAnswerdNotiffications_1.default(itemObject.ID, itemObject.userID, itemObject.requestID, itemObject.read, itemObject.timestamp);
            case notifcationsEnums_1.default.ProjectJoinRequestNotification.toString():
                return new projectJoinRequestNotification_1.default(itemObject.ID, itemObject.projectID, itemObject.userID, itemObject.requestID, itemObject.read, itemObject.timestamp);
            case notifcationsEnums_1.default.UserJoinRequestToRelatedProjectNotification.toString():
                return new userJoinRequestToRelatedProjectNotification_1.default(itemObject.ID, itemObject.projectID, itemObject.userID, itemObject.requestID, itemObject.read, itemObject.timestamp);
        }
    }
    createProjectJoinRequestNotification(projectID, userID, requestID) {
        return new projectJoinRequestNotification_1.default(undefined, projectID, userID, requestID);
    }
    createUserJoinRequestNotification(projectID, userIDs, requestID) {
        return userIDs.map(uid => new userJoinRequestToRelatedProjectNotification_1.default(undefined, projectID, uid, requestID));
    }
}
exports.default = NotificationsFactory;
//# sourceMappingURL=notificationsFactory.js.map