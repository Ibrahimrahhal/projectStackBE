import JoinRequest from './joinRequest';

export default class UserJoinRequest extends JoinRequest {
    actionDoneBy:string;
    

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
    markAsAccepted = (UserIDThatAccepted:string, message:string)=>{
        this.accepted = true;
        this.actionDoneBy = UserIDThatAccepted
        this.acceptionMessage = message;
    }

    markAsRejected = (UserIDThatRejected:string, message:string)=>{
        this.rejected = true;
        this.actionDoneBy = UserIDThatRejected
        this.rejectionMessage = message 
    }
}


