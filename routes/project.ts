import express, { Response, Request } from 'express';
import { 
    encryptData, 
    decryptData,
} from '../util';
import ProjectController from '../controllers/projectController';
import ProjectEnrollmentController from '../controllers/projectEnrollmentController';
import Project from '../schemas/project/project';
import ProjectsFactory from '../factories/projectsFactory';
import ProjectEnrollmentFactory from '../factories/projectEnrollmentsFactory';


const router = express.Router();
const ProjectsFactoryInstance = new ProjectsFactory();


router.get('/', async (req:Request, res:Response)=>{
    let projects = await ProjectEnrollmentController.getInstance().getProjectsOfUsers((req as any).user.email);
    let results = projects.map(p=>p.serializeAsJSON());
    res.json({data: encryptData(results)});
});


router.get('/:ID', async (req, res) => {    
    let project = (await ProjectController.getInstance().getItem(req.params['ID'])) as Project;
    let withMembers = req.query["members"];
    if(withMembers)
        project.setMembers(await ProjectEnrollmentController.getInstance().getMembersOfProject(project.ID));
    res.json({data: encryptData(project.serializeAsJSON())});
});

router.post('/', async (req, res)=>{
    let { data } = req.body;
    let enrollmentFactory = new ProjectEnrollmentFactory();
    let project = ProjectsFactoryInstance.createItem({...JSON.parse(decryptData(data)), creatorEmail: (req as any).user.email, timeCreated: Date.now()});
    await ProjectController.getInstance().insertItem(project);
    let enrollemnt = enrollmentFactory.createItemParams((req as any).user.email, project.ID, true);
    await ProjectEnrollmentController.getInstance().addMemberToProject(enrollemnt)
    res.json({data:encryptData("success")});
});

router.patch('/:ID', async (req, res)=>{
    let { data } = req.body;
    let project  = ProjectsFactoryInstance.createItem(JSON.parse(decryptData(data)));
    await ProjectController.getInstance().patchItem(project);
    res.json({data:encryptData("success")});
});


router.get('/:ID/members', async (req, res)=>{
    let projectID = req.params['ID'];
    let members = await ProjectEnrollmentController.getInstance().getMembersOfProject(projectID);
    res.json({data: encryptData(members.map(member=>member.serializeAsJSON()))});
})




// router.delete('/:ID/member/:email', async (req,res)=>{
// let project = Project.getProject(req.param("ID"));
// if(!project.isUserHasPrem(req.user.email)){
//     res.sendStatus(401);
//     return;
// }
// let email = decryptData(req.param('email'));
// let result = prmosieBasedDeleteItem({
//     Key: {ID: {"S":hashFunction(project.ID + email)}},
//     TableName: Config.tables.projectUserTable
// })
// res.json(result)
// });

export default router;