import JoinRequest from './joinRequest';
export default class ProjectJoinRequest extends JoinRequest {
    type:number = 1;
    markAsAccepted = (message:string)=>{
        this.accepted = true;
        this.acceptionMessage = message;
    }

    markAsRejected = (message:string)=>{
        this.rejected = true;
        this.rejectionMessage = message;
    }
}
