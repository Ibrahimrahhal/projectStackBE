
import express, { Router } from 'express';
import { encryptData, base64ToString, decryptData, asyncMap } from '../util';
import EnrollemntFactory from '../factories/projectEnrollmentsFactory';
import RequestFactory from '../factories/joinRequestFactory';
import RequestController from '../controllers/joinRequestsController';
import JoinRequest from '../schemas/joinRequests/joinRequest';
import ProjectUserRelations from '../schemas/relations/ProjectEnrollment';
import ProjectEnrollmentController from '../controllers/projectEnrollmentController';
import ProjectJoinRequest from '../schemas/joinRequests/projectJoinRequest';
import UserJoinRequest from '../schemas/joinRequests/userJoinRequest';
import NotificationsFactory from '../factories/notificationsFactory';
import NotificationsController from '../controllers/NotificationsController';
import Notification from '../schemas/notifications/notification';

const router:Router = express.Router();


router.post('/join/:projectID', async (req, res)=>{
let  { projectID } = req.params;
let { email } = (req as any).user;
let projectMembersIds = await ProjectEnrollmentController.getInstance().getMemberIDSOfProject(projectID);
let  data = JSON.parse(decryptData(req.body.data));
let factory = new RequestFactory();
let notificationFactory = new NotificationsFactory();
let request = factory.CreateUserJoinRequest({ userID:email, projectID, message:data.message });
let notications = notificationFactory.createUserJoinRequestNotification(projectID, projectMembersIds, request.ID);
// try{
    await RequestController.getInstance().insertItem(request);
    await asyncMap(notications, async (noti:Notification)=>{
        await NotificationsController.getInstance().insertItem(noti);
    });
    res.json({data:encryptData("success")});
// }catch(e){
//     console.log
//     res.sendStatus(500);
// }
});

router.post('/invite/:userID/:projectID', async (req, res)=>{
    let { projectID, userID } = req.params;
    let email = base64ToString(userID);
    let data = JSON.parse(decryptData(req.body.data));
    let factory = new RequestFactory();
    let notificationFactory = new NotificationsFactory();
    let request = factory.CreateProjectJoinRequest({ userID:email, projectID, message:data.message });
    let notication = notificationFactory.createProjectJoinRequestNotification(projectID, email, request.ID); 
    try{
        await RequestController.getInstance().insertItem(request);
        await NotificationsController.getInstance().insertItem(notication);
        res.json({data:encryptData("success")});
    }catch(e){
        res.sendStatus(500);
    }
});

router.post('/invitation/:invitationID/accept', async(req, res)=>{
    try{
    let { invitationID } = req.params;
    let userEmail = (req as any).user.email;
    let invitaion:JoinRequest = await RequestController.getInstance().getItem( invitationID ) as JoinRequest;
    let enrollmentFactory = new EnrollemntFactory();
    let data = JSON.parse(encryptData(req.body)).data;
    let enrollemnt:ProjectUserRelations;
    if(invitaion instanceof ProjectJoinRequest){
        (invitaion as ProjectJoinRequest).markAsAccepted(data.message);
        enrollemnt = enrollmentFactory.createItemParams(userEmail, invitaion.projectID);
    }else{
        (invitaion as UserJoinRequest).markAsAccepted((req as any).user.email as string, data.message as string);
        enrollemnt = enrollmentFactory.createItemParams(invitaion.userID, invitaion.projectID);
    }
    await RequestController.getInstance().patchItem(invitaion);
    await ProjectEnrollmentController.getInstance().addMemberToProject(enrollemnt);
    res.json({data:encryptData("success")});
    }catch(e){
    res.sendStatus(500);
    }
});


router.post('/invitaion/:invitationID/reject', async (req, res)=>{
    try{
        let { invitationID } = req.params;
        let invitaion:JoinRequest = await RequestController.getInstance().getItem( invitationID ) as JoinRequest;
        let data = JSON.parse(encryptData(req.body)).data;
        if(invitaion instanceof ProjectJoinRequest)
            (invitaion as ProjectJoinRequest).markAsRejected(data.message);
        else
            (invitaion as UserJoinRequest).markAsRejected((req as any).user.email as string, data.message as string);
        await RequestController.getInstance().patchItem(invitaion);
        res.json({data:encryptData("success")});
        }catch(e){
        res.sendStatus(500);
        }
});


router.get('/invitaions', async(req, res)=>{ 
    try{
    let userID = (req as any).user.email;
    let invitaions = await RequestController.getInstance().getInvitaionsForUser(userID);    
    res.json({
        data:encryptData(invitaions.map(i=>i.serializeAsJSON()))
    });
    }catch(e){
        res.sendStatus(500);
    }
});


router.get('/requests/:projectID', async (req, res)=>{
    try{
        let { projectID } = req.params;
        let requests = await RequestController.getInstance().getRequestsForProject(projectID);    
        res.json({
            data:encryptData(requests.map(r=>r.serializeAsJSON()))
        });
        }catch(e){
            res.sendStatus(500);
        }
});



export default router;
