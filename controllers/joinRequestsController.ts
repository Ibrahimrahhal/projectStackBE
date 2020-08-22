import JoinRequestsFactory from "../factories/joinRequestFactory";
import JoinRequest from "../schemas/joinRequests/joinRequest";
import DynamodbController from "./dynamodb/dynamodbController";
import Config from '../config';
export default class JoinRequestController extends DynamodbController<JoinRequest>{
    static instance:JoinRequestController;

    totalAttr  = {
        ID: "S",
        userID: "S",
        projectID: "S",
        message: "S",
        accepted: "BOOL",
        rejected: "BOOL",
        rejectionMessage: "S",
        acceptionMessage: "S",
        timestamp: "N",
        type:"N",
        actionDoneBy:"S"
     };
    toStringAtrr:Array<string> = []
    primaryKey = "ID";
    dynamodbTable = Config.tables.projectJoinRequest;
    Factory = new JoinRequestsFactory();

    private constructor(){
        super();
    }

    static getInstance():JoinRequestController{
        if(JoinRequestController.instance)
            return JoinRequestController.instance;
            JoinRequestController.instance = new JoinRequestController();
        return JoinRequestController.getInstance();
    }
}