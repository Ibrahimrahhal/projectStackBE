import UserJoinRequest from '../joinRequests/userJoinRequest';
import Notification from './notification';

export default class UserJoinRequestToRelatedProjectNotification extends Notification{
    Type:number = 1;
    projectID:string;
    RequestID:string;
    constructor(
        ID:string, 
        projectID:string, 
        userID:string, 
        JoinRequestID:string,
        read:boolean = false){
        super(ID, userID, read);
        this.projectID = projectID;
        this.RequestID = JoinRequestID;
    }
}



module.exports = UserJoinRequestToRelatedProjectNotification;