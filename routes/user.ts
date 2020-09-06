
import express, { Router } from 'express';
import UserController from '../controllers/UserController';
import { encryptData, decryptData, base64ToString } from '../util';
import { validateUpdateReqBelongToSameUser } from '../protectedRouteMiddleware';
import User from '../schemas/user/user';

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
    try{
        let user = await UserController.getInstance().getItem(email) as User;
        res.json({ data: encryptData(user.serializeAsJSON()) });
    }catch(e){
        res.sendStatus(500);
    }
});


export default router;