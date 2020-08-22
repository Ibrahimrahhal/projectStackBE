import ProjectJoinRequest from '../joinRequests/projectJoinRequest';
import Notification from './notification';


export default class ProjectJoinRequestNotification extends Notification{
    Type:number = 2;
    projectID:string;
    RequestID:string;

    constructor(ID:string, projectID:string, userID:string, RequestID:string, read:boolean = false){
        super(ID, userID, read);
        this.projectID = projectID;
        this.RequestID = RequestID;
    }
}


