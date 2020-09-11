"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const users_1 = __importDefault(require("./users"));
const project_1 = __importDefault(require("./project"));
const projects_1 = __importDefault(require("./projects"));
const storage_1 = __importDefault(require("./storage"));
// import invitaionRoute from './invitations';
const router = express_1.default.Router();
router.use('/user', user_1.default);
router.use('/users', users_1.default);
router.use('/project', project_1.default);
router.use('/projects', projects_1.default);
router.use('/storage', storage_1.default);
// router.use('/invitations', invitationRouter);
router.get('/', (req, res) => {
    res.json(req.user);
});
router.all('/', (req, res) => {
    res.sendStatus(404);
});
exports.default = router;
//# sourceMappingURL=index.js.map