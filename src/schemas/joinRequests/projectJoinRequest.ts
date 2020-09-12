import JoinRequest, { markWithMithSingleUsers } from './joinRequest';
import joinRequestsTypes from './joinRequestsTypes';
export default class ProjectJoinRequest extends JoinRequest {
    type:number = joinRequestsTypes.ProjectJoinRequest;
    markAsAccepted:markWithMithSingleUsers = (message:string)=>{
        this.accepted = true;
        this.acceptionMessage = message;
    }

    markAsRejected:markWithMithSingleUsers = (message:string)=>{
        this.rejected = true;
        this.rejectionMessage = message;
    }
}
