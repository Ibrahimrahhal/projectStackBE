
import express from 'express';
import UserController from '../controllers/UserController';

import { decryptData, encryptData } from '../util';

const router = express.Router();

router.post('/', async (req,res)=>{
    let query = JSON.parse(decryptData(req.body.data));
    let results = await UserController.getInstance().Search(query, (req as any).user.email);
    results.results  = results.results.map((user)=>{
        return user.serializeAsJSON();
    });
    res.json({data: encryptData(results)});
});



export default router;