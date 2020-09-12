import JoinRequestTypeEnum  from '../schemas/joinRequests/joinRequestsTypes';
import ProjectJoinRequest from "../schemas/joinRequests/projectJoinRequest";
import JoinRequest from "../schemas/joinRequests/joinRequest";
import Factory from "./factory";
import UserJoinRequest from "../schemas/joinRequests/userJoinRequest";

export default class JoinRequestsFactory extends Factory<JoinRequest>{

    public createItem(json:any):JoinRequest{
        const { type } = json;
        switch(type){
            case JoinRequestTypeEnum.ProjectJoinRequest:
                return this.CreateProjectJoinRequest(json);
            case JoinRequestTypeEnum.UserJoinRequest:
                return this.CreateUserJoinRequest(json);
        }
    }

    public CreateProjectJoinRequest({
        ID, 
        userID, 
        projectID, 
        message, 
        accepted, 
        rejected, 
        rejectionMessage,
        acceptionMessage,
        timestamp
    }:any):JoinRequest {
        
        let joinReq = new ProjectJoinRequest(
            ID, 
            userID, 
            projectID, 
            message, 
            accepted, 
            rejected, 
            rejectionMessage,
            acceptionMessage,
            timestamp);
        return joinReq;
    }

    public CreateUserJoinRequest({
        ID, 
        userID, 
        projectID, 
        message, 
        accepted, 
        rejected, 
        rejectionMessage,
        acceptionMessage,
        timestamp,
        actionDoneBy
    }:any):JoinRequest{
        let joinReq = new UserJoinRequest(
            ID, 
            userID, 
            projectID, 
            message, 
            accepted, 
            rejected, 
            rejectionMessage,
            acceptionMessage,
            timestamp,
            actionDoneBy);
        return joinReq;
    }
    
}

