import NotificationsController from '../controllers/NotificationsController';
import express, { Router } from 'express';
import { asyncMap, encryptData } from '../util';
import Notification from '../schemas/notifications/notification';
import JoinRequestController from '../controllers/joinRequestsController';
import notifcationsEnums from '../schemas/notifications/notifcationsEnums';
import ProjectJoinRequestNotification from '../schemas/notifications/projectJoinRequestNotification';
import UserController from '../controllers/UserController';
import ProjectController from '../controllers/projectController';

const router:Router = express.Router();


router.get('/', async (req, res)=>{
    let { email } = (req as any).user;
    let notifications = await NotificationsController.getInstance().getAllNotificationsForUser(email);
    let notificationsWithExtras:{notification:any, extras:any}[] = notifications.map((noti)=>{
        return {
            notification:noti.serializeAsJSON(),
            extras:{}
        };
    });
    await asyncMap(notificationsWithExtras, async (notification:{notification:any, extras:any})=>{
        if(![
            notifcationsEnums.ProjectJoinRequestNotification,
            notifcationsEnums.JoinRequestAnsweredNotification,
            notifcationsEnums.UserJoinRequestToRelatedProjectNotification
        ].includes(notification.notification.type))
        return notification;
        let req = await JoinRequestController.getInstance().getItemCheap(notification.notification.requestID);
        notification.extras.joinRequest = req.serializeAsJSON();
        switch(notification.notification.type){
            case notifcationsEnums.UserJoinRequestToRelatedProjectNotification:
                let user = await UserController.getInstance().getItemCheap(req.userID);
                notification.extras.user = user.serializeAsJSON();
                break;
            case notifcationsEnums.ProjectJoinRequestNotification:
                let project;
                try{
                    project = await ProjectController.getInstance().getItemCheap(req.projectID);
                    notification.extras.project = project.serializeAsJSON();
                }catch(e){
                    console.log(e.toString())
                }
                
                break;
        }
        return notification;
    })
    notificationsWithExtras = notificationsWithExtras.sort((a,b) => (b.notification as Notification).timestamp - (a.notification as Notification).timestamp)
    res.json({data:encryptData(notificationsWithExtras)});
});

export default router;