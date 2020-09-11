import UserJoinRequest from '../joinRequests/userJoinRequest';
import notifcationsEnums from './notifcationsEnums';
import Notification from './notification';

export default class UserJoinRequestToRelatedProjectNotification extends Notification{
    type:number = notifcationsEnums.UserJoinRequestToRelatedProjectNotification;
    projectID:string;
    requestID:string;
    constructor(
        ID:string, 
        projectID:string, 
        userID:string, 
        JoinRequestID:string,
        read:boolean = false,
        timestamp?:number){
        super(ID, userID, read, timestamp);
        this.projectID = projectID;
        this.requestID = JoinRequestID;
    }
}
