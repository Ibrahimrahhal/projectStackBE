import ProjectJoinRequest from '../joinRequests/projectJoinRequest';
import notifcationsEnums from './notifcationsEnums';
import Notification from './notification';


export default class ProjectJoinRequestNotification extends Notification{
    type:number = notifcationsEnums.ProjectJoinRequestNotification;
    projectID:string;
    requestID:string;

    constructor(
        ID:string, 
        projectID:string, 
        userID:string, 
        RequestID:string, 
        read:boolean = false, 
        timestamp?:number){
        super(ID, userID, read, timestamp);
        this.projectID = projectID;
        this.requestID = RequestID;
    }
}


