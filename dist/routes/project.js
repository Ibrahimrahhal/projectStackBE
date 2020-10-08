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
const projectController_1 = __importDefault(require("../controllers/projectController"));
const projectEnrollmentController_1 = __importDefault(require("../controllers/projectEnrollmentController"));
const projectsFactory_1 = __importDefault(require("../factories/projectsFactory"));
const projectEnrollmentsFactory_1 = __importDefault(require("../factories/projectEnrollmentsFactory"));
const joinRequestsController_1 = __importDefault(require("../controllers/joinRequestsController"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.default.Router();
const ProjectsFactoryInstance = new projectsFactory_1.default();
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let projects = yield projectEnrollmentController_1.default.getInstance().getProjectsOfUsers(req.user.email);
    yield util_1.asyncMap(projects, (projectExtra) => __awaiter(this, void 0, void 0, function* () {
        let { project } = projectExtra;
        project.setMembers(yield projectEnrollmentController_1.default.getInstance().getMembersOfProject(project.ID));
    }));
    projects.map(p => p.project = p.project.serializeAsJSON());
    res.json({ data: util_1.encryptData(projects) });
}));
router.get('/:ID', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let project = (yield projectController_1.default.getInstance().getItem(req.params['ID']));
    let withMembers = req.query["members"];
    if (withMembers)
        project.setMembers(yield projectEnrollmentController_1.default.getInstance().getMembersOfProject(project.ID));
    res.json({ data: util_1.encryptData(project.serializeAsJSON()) });
}));
router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { data } = req.body;
    let enrollmentFactory = new projectEnrollmentsFactory_1.default();
    let project = ProjectsFactoryInstance.createItem(Object.assign({}, JSON.parse(util_1.decryptData(data)), { creatorEmail: req.user.email, timeCreated: Date.now() }));
    yield projectController_1.default.getInstance().insertItem(project);
    let enrollemnt = enrollmentFactory.createItemParams(req.user.email, project.ID, true);
    yield projectEnrollmentController_1.default.getInstance().addMemberToProject(enrollemnt);
    res.json({ data: util_1.encryptData("success") });
}));
router.patch('/:ID', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { data } = req.body;
    let project = ProjectsFactoryInstance.createItem(JSON.parse(util_1.decryptData(data)));
    yield projectController_1.default.getInstance().patchItem(project);
    res.json({ data: util_1.encryptData("success") });
}));
router.get('/:ID/members', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let projectID = req.params['ID'];
    let members = yield projectEnrollmentController_1.default.getInstance().getMembersOfProject(projectID);
    res.json({ data: util_1.encryptData(members.map(member => member.serializeAsJSON())) });
}));
router.get('/:ID/join-requests', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let projectID = req.params['ID'];
    let requests = yield joinRequestsController_1.default.getInstance().getRequestsForProject(projectID);
    let requestWithExtras = yield util_1.asyncMap(requests, (request) => __awaiter(this, void 0, void 0, function* () {
        return {
            request: request.serializeAsJSON(),
            extras: {
                user: yield UserController_1.default.getInstance().getItemCheap(request.userID)
            }
        };
    }));
    res.json({ data: util_1.encryptData(requestWithExtras) });
}));
// router.delete('/:ID/member/:email', async (req,res)=>{
// let project = Project.getProject(req.param("ID"));
// if(!project.isUserHasPrem(req.user.email)){
//     res.sendStatus(401);
//     return;
// }
// let email = decryptData(req.param('email'));
// let result = prmosieBasedDeleteItem({
//     Key: {ID: {"S":hashFunction(project.ID + email)}},
//     TableName: Config.tables.projectUserTable
// })
// res.json(result)
// });
exports.default = router;
//# sourceMappingURL=project.js.map