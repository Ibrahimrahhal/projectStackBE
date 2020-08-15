import JoinRequest from './joinRequest';

export default class UserJoinRequest extends JoinRequest {
    type:number = 2;
    actionDoneBy:string;
    
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


