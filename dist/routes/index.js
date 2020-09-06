"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import UserRoute from './user';
// import UsersRoute from './users';
// import projectRoute from '.project';
// import storageRoute from './storage';
// import invitaionRoute from './invitations';
const router = express_1.default.Router();
// router.use('/user', userRouter);
// router.use('/users', usersRouter);
// router.use('/project', projectRouter);
// router.use('/projects', projectsRouter);
// router.use('/storage', storageRouter);
// router.use('/invitations', invitationRouter);
router.get('/', (req, res) => {
    res.json(req.user);
});
router.all('/', (req, res) => {
    res.sendStatus(404);
});
module.exports = router;
//# sourceMappingURL=index.js.map