"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationsController_1 = __importDefault(require("../controllers/NotificationsController"));
const express_1 = __importDefault(require("express"));
const util_1 = require("../util");
const joinRequestsController_1 = __importDefault(require("../controllers/joinRequestsController"));
const notifcationsEnums_1 = __importDefault(require("../schemas/notifications/notifcationsEnums"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const projectController_1 = __importDefault(require("../controllers/projectController"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { email } = req.user;
    let notifications = yield NotificationsController_1.default.getInstance().getAllNotificationsForUser(email);
    let notificationsWithExtras = notifications.map((noti) => {
        return {
            notification: noti.serializeAsJSON(),
            extras: {}
        };
    });
    yield util_1.asyncMap(notificationsWithExtras, (notification) => __awaiter(this, void 0, void 0, function* () {
        if (![
            notifcationsEnums_1.default.ProjectJoinRequestNotification,
            notifcationsEnums_1.default.JoinRequestAnsweredNotification,
            notifcationsEnums_1.default.UserJoinRequestToRelatedProjectNotification
        ].includes(notification.notification.type))
            return notification;
        let req = yield joinRequestsController_1.default.getInstance().getItemCheap(notification.notification.requestID);
        notification.extras.joinRequest = req.serializeAsJSON();
        switch (notification.notification.type) {
            case notifcationsEnums_1.default.UserJoinRequestToRelatedProjectNotification:
                let user = yield UserController_1.default.getInstance().getItemCheap(req.userID);
                notification.extras.user = user.serializeAsJSON();
                break;
            case notifcationsEnums_1.default.ProjectJoinRequestNotification:
                let project;
                try {
                    project = yield projectController_1.default.getInstance().getItemCheap(req.projectID);
                    notification.extras.project = project.serializeAsJSON();
                }
                catch (e) {
                    console.log(e.toString());
                }
                break;
        }
        return notification;
    }));
    notificationsWithExtras = notificationsWithExtras.sort((a, b) => b.notification.timestamp - a.notification.timestamp);
    res.json({ data: util_1.encryptData(notificationsWithExtras) });
}));
exports.default = router;
//# sourceMappingURL=notifications.js.map