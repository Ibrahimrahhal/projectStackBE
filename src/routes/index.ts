
import express, { Router } from 'express';
import UserRoute from './user';
import UsersRoute from './users';
import ProjectRoute from './project';
import ProjectsRoute from './projects';
import StorageRoute from './storage';
import invitaionRoute from './invitations';
import notificationRouter from './notifications';
const router:Router = express.Router();

router.use('/user', UserRoute);
router.use('/users', UsersRoute);
router.use('/project', ProjectRoute);
router.use('/projects', ProjectsRoute);
router.use('/storage', StorageRoute);
router.use('/notifications', notificationRouter);
router.use('/', invitaionRoute);

router.get('/',(req:any,res)=>{
  res.json(req.user);
});

router.all('/', (req, res)=>{
  res.sendStatus(404);
});



export default router;
