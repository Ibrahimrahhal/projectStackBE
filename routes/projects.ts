
import express from 'express';
import ProjectsContoller from '../controllers/projectController';
import { encryptData } from '../util';

const router = express.Router();

router.get('/', async (req, res)=>{
    let projects = await ProjectsContoller.getInstance().getAllItems();
    let regularObjects  = projects.map((project)=>{
        return project.serializeAsJSON();
    })
    res.json({data: encryptData(regularObjects)});
});



export default router;