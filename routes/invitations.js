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
const express_1 = __importDefault(require("express"));
const util_1 = require("../util");
const projectEnrollmentsFactory_1 = __importDefault(require("../factories/projectEnrollmentsFactory"));
const joinRequestFactory_1 = __importDefault(require("../factories/joinRequestFactory"));
const joinRequestsController_1 = __importDefault(require("../controllers/joinRequestsController"));
const projectEnrollmentController_1 = __importDefault(require("../controllers/projectEnrollmentController"));
const projectJoinRequest_1 = __importDefault(require("../schemas/joinRequests/projectJoinRequest"));
const notificationsFactory_1 = __importDefault(require("../factories/notificationsFactory"));
const NotificationsController_1 = __importDefault(require("../controllers/NotificationsController"));
const router = express_1.default.Router();
router.post('/join/:projectID', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { projectID } = req.params;
    let { email } = req.user;
    let projectMembersIds = yield projectEnrollmentController_1.default.getInstance().getMemberIDSOfProject(projectID);
    let data = JSON.parse(util_1.decryptData(req.body.data));
    let factory = new joinRequestFactory_1.default();
    let notificationFactory = new notificationsFactory_1.default();
    let request = factory.CreateUserJoinRequest({ userID: email, projectID, message: data.message });
    let notications = notificationFactory.createUserJoinRequestNotification(projectID, projectMembersIds, request.ID);
    // try{
    yield joinRequestsController_1.default.getInstance().insertItem(request);
    yield util_1.asyncMap(notications, (noti) => __awaiter(this, void 0, void 0, function* () {
        yield NotificationsController_1.default.getInstance().insertItem(noti);
    }));
    res.json({ data: util_1.encryptData("success") });
    // }catch(e){
    //     console.log
    //     res.sendStatus(500);
    // }
}));
router.post('/invite/:userID/:projectID', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { projectID, userID } = req.params;
    let email = util_1.base64ToString(userID);
    let data = JSON.parse(util_1.decryptData(req.body.data));
    let factory = new joinRequestFactory_1.default();
    let notificationFactory = new notificationsFactory_1.default();
    let request = factory.CreateProjectJoinRequest({ userID: email, projectID, message: data.message });
    let notication = notificationFactory.createProjectJoinRequestNotification(projectID, email, request.ID);
    try {
        yield joinRequestsController_1.default.getInstance().insertItem(request);
        yield NotificationsController_1.default.getInstance().insertItem(notication);
        res.json({ data: util_1.encryptData("success") });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
router.post('/invitation/:invitationID/accept', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let { invitationID } = req.params;
        let userEmail = req.user.email;
        let invitaion = yield joinRequestsController_1.default.getInstance().getItem(invitationID);
        let enrollmentFactory = new projectEnrollmentsFactory_1.default();
        let data = JSON.parse(util_1.encryptData(req.body)).data;
        let enrollemnt;
        if (invitaion instanceof projectJoinRequest_1.default) {
            invitaion.markAsAccepted(data.message);
            enrollemnt = enrollmentFactory.createItemParams(userEmail, invitaion.projectID);
        }
        else {
            invitaion.markAsAccepted(req.user.email, data.message);
            enrollemnt = enrollmentFactory.createItemParams(invitaion.userID, invitaion.projectID);
        }
        yield joinRequestsController_1.default.getInstance().patchItem(invitaion);
        yield projectEnrollmentController_1.default.getInstance().addMemberToProject(enrollemnt);
        res.json({ data: util_1.encryptData("success") });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
router.post('/invitaion/:invitationID/reject', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let { invitationID } = req.params;
        let invitaion = yield joinRequestsController_1.default.getInstance().getItem(invitationID);
        let data = JSON.parse(util_1.encryptData(req.body)).data;
        if (invitaion instanceof projectJoinRequest_1.default)
            invitaion.markAsRejected(data.message);
        else
            invitaion.markAsRejected(req.user.email, data.message);
        yield joinRequestsController_1.default.getInstance().patchItem(invitaion);
        res.json({ data: util_1.encryptData("success") });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
router.get('/invitaions', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let userID = req.user.email;
        let invitaions = yield joinRequestsController_1.default.getInstance().getInvitaionsForUser(userID);
        res.json({
            data: util_1.encryptData(invitaions.map(i => i.serializeAsJSON()))
        });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
router.get('/requests/:projectID', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let { projectID } = req.params;
        let requests = yield joinRequestsController_1.default.getInstance().getRequestsForProject(projectID);
        res.json({
            data: util_1.encryptData(requests.map(r => r.serializeAsJSON()))
        });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
exports.default = router;
//# sourceMappingURL=invitations.js.map