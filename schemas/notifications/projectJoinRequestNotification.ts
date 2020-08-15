import ProjectJoinRequest from '../joinRequests/projectJoinRequest';
import Notification from './notification';


export default class ProjectJoinRequestNotification extends Notification{
    Type:number = 2;
    projectID:string;
    userID:string;
    JoinRequest:ProjectJoinRequest;
    
    constructor(ID:string, projectID:string, userID:string, JoinRequest:ProjectJoinRequest){
        super(ID);
        this.projectID = projectID;
        this.userID = userID;
        this.JoinRequest = JoinRequest;
    }
}


