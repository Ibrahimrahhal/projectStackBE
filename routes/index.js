const router = require('express').Router();
const userRouter = require('./user');
const usersRouter = require('./users');
const projectRouter = require('./project');
const projectsRouter = require('./projects');
const storageRouter = require('./storage');
const invitationRouter = require('./invitations');
router.use('/user', userRouter);
router.use('/users', usersRouter);
router.use('/project', projectRouter);
router.use('/projects', projectsRouter);
router.use('/storage', storageRouter);
router.use('/invitations', invitationRouter);

router.get('/',(req,res)=>{
  res.json(req.user);
});

router.all('/', (req, res)=>{
  res.sendStatus(404);
});



module.exports = router;
