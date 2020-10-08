
import express from 'express';
import ProjectsContoller from '../controllers/projectController';
import { decryptData, encryptData } from '../util';

const router = express.Router();

router.post('/', async (req, res)=>{
    let query = JSON.parse(decryptData(req.body.data));
    let results = await ProjectsContoller.getInstance().Search(query);
    results.results  = results.results.map((project)=>{
        return project.serializeAsJSON();
    });
    res.json({data: encryptData(results)});
});



export default router;