import NotificationsController from '../controllers/NotificationsController';
import express, { Router } from 'express';
import { encryptData } from '../util';

const router:Router = express.Router();


router.get('/', async (req, res)=>{
    let { email } = (req as any).user;
    let notifications = await NotificationsController.getInstance().getAllNotificationsForUser(email);
    notifications = notifications.map(noti=>noti.serializeAsJSON());
    res.json({data:encryptData(notifications)});
});

export default router;