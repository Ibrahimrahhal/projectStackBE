import UserJoinRequest from '../joinRequests/userJoinRequest';
import Notification from './notification';

export default class UserJoinRequestToRelatedProjectNotification extends Notification{
    Type:number = 1;
    projectID:string;
    senderUserID:string;
    receiverUserID:string;
    JoinRequest:UserJoinRequest;
    constructor(
        ID:string, 
        projectID:string, 
        senderProjectID:string, 
        userID:string, 
        JoinRequest:UserJoinRequest){
        super(ID);
        this.projectID = projectID;
        this.senderUserID = senderProjectID;
        this.receiverUserID = userID;
        this.JoinRequest = JoinRequest;
    }
}



module.exports = UserJoinRequestToRelatedProjectNotification;