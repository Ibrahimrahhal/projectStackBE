import notifcationsEnums from './notifcationsEnums';
import Notification from './notification';
export default class JoinRequestAnsweredNotification extends Notification{
    type:number = notifcationsEnums.JoinRequestAnsweredNotification;
    requestID:string;
    constructor(
        ID:string, 
        userID:string, 
        RequestID:string, 
        read:boolean = false, 
        timestamp?:number){
        super(ID, userID, read, timestamp);
        this.requestID = RequestID;
    }
}

