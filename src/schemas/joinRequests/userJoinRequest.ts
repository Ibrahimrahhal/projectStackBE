import JoinRequest, { markWithMithMultipleUsers } from './joinRequest';
import joinRequestsTypes from './joinRequestsTypes';

export default class UserJoinRequest extends JoinRequest {
    actionDoneBy:string;
    type:number = joinRequestsTypes.UserJoinRequest;
    

    constructor(
        ID:string, 
        userID:string, 
        projectID:string, 
        message:string = "", 
        accepted:boolean = false, 
        rejected:boolean = false, 
        rejectionMessage:string = "",
        acceptionMessage:string = "",
        timestamp:number = Date.now(),
        actionDoneBy?:string){
            super(ID, 
                userID, 
                projectID, 
                message, 
                accepted, 
                rejected, 
                rejectionMessage,
                acceptionMessage,
                timestamp);
        this.actionDoneBy = actionDoneBy;
        
    }
    markAsAccepted:markWithMithMultipleUsers = (UserIDThatAccepted:string, message:string)=>{
        this.accepted = true;
        this.actionDoneBy = UserIDThatAccepted
        this.acceptionMessage = message;
    }

    markAsRejected:markWithMithMultipleUsers = (UserIDThatRejected:string, message:string)=>{
        this.rejected = true;
        this.actionDoneBy = UserIDThatRejected
        this.rejectionMessage = message 
    }
}


