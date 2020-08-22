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
        
        joinReq.type =  JoinRequestTypeEnum.ProjectJoinRequest;
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
        
        joinReq.type =  JoinRequestTypeEnum.UserJoinRequest;
        return joinReq;
    }
    
}

const JoinRequestTypeEnum = {
    ProjectJoinRequest:1,
    UserJoinRequest:2
}