
import express, { Router } from 'express';
import UserController from '../controllers/UserController';
import { encryptData, decryptData, base64ToString } from '../util';
import { validateUpdateReqBelongToSameUser } from '../protectedRouteMiddleware';
import User from '../schemas/user/user';
import ProjectController from '../controllers/projectController';
import ProjectEnrollmentController from '../controllers/projectEnrollmentController';

const router:Router = express.Router();

router.patch('/' , async (req,res)=>{
    let user = {...JSON.parse(decryptData(req.body.data)), email:(req as any).user.email};
    try{
        await UserController.getInstance().patch(user);
        res.json({});
    }catch(e){
        console.log(e.toString());
        res.sendStatus(500);
    }
    
});

router.get('/', async (req,res)=>{
    try{
        let user = await UserController.getInstance().getItem((req as any).user.email) as User;
        res.json({ data: encryptData(user.serializeAsJSON()) });
    }catch(e){
        res.sendStatus(500);
    }
});

router.get('/:ID', async (req,res)=>{
    let email = base64ToString(req.params['ID']);
    let withProject = req.query['projects'];
    try{
        let user = await UserController.getInstance().getItem(email) as User;
        let projects;
        if(withProject){
        projects = await ProjectEnrollmentController.getInstance().getProjectsOfUsers(user.email);
        projects = projects.map((projWithExtras)=>{
            projWithExtras.project = projWithExtras.project.serializeAsJSON();
            return projWithExtras;
        });
    }
        user = user.serializeAsJSON();
        res.json({ data: encryptData({ user, projects }) });
    }catch(e){
        res.sendStatus(500);
    }
});


export default router;