
import express from 'express';
import UserController from '../controllers/UserController';
import { encryptData } from '../util';

const router = express.Router();

router.get('/', async (req,res)=>{
    let users = await UserController.getInstance().getAllItems();
    let regularObjects  = users.filter((user)=>{
        return user.isVerfied();
    }).map((user)=>{
        return user.serializeAsJSON();
    });
    res.json({data: encryptData(regularObjects)});
});



export default router;