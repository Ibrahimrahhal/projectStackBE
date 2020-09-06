import JoinRequestsFactory from "../factories/joinRequestFactory";
import JoinRequest from "../schemas/joinRequests/joinRequest";
import DynamodbController from "./dynamodb/dynamodbController";
import Config from '../config';
import Elasticsearch from './elasticsearch/elasticSearchController';
import Indexable from "./elasticsearch/elasticsearch_indexable";
import ElasticsearchController from "./elasticsearch/elasticSearchController";
import elasticsearchResponse from "./elasticsearch/elasticsearch_response_body";

export default class JoinRequestController extends DynamodbController<JoinRequest> implements Indexable{
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
    indexName = Config.elasticsearch.indices.joinRequests;

    private constructor(){
        super();
    }

    static getInstance():JoinRequestController{
        if(JoinRequestController.instance)
            return JoinRequestController.instance;
            JoinRequestController.instance = new JoinRequestController();
        return JoinRequestController.getInstance();
    }

    async createItem(request:JoinRequest){
        await super.insertItem(request);
        await Elasticsearch.insertItem(this.indexName, request.serializeAsJSON());
    }

    getItem(ID:string | Array<string>):Promise<JoinRequest | JoinRequest[]>{
        return super.getItem(ID);
    }

    async patchItem(Item:JoinRequest):Promise<void>{
        await super.patchItem(Item);
        await Elasticsearch.PatchItem(this.indexName, Item.serializeAsJSON());
        return;
    }

    async getInvitaionsForUser(UserID:string):Promise<JoinRequest[]>{
        let result= await ElasticsearchController.search(this.indexName, {
            filter:[{type:'match', feild:'userID', value:UserID}]
        }, undefined);
        let data:elasticsearchResponse<JoinRequest> = result.body;
        return data.hits.hits.map(single=>this.Factory.createItem(single._source));
    }

    async getRequestsForProject(UserID:string):Promise<JoinRequest[]>{
        let result= await ElasticsearchController.search(this.indexName, {
            filter:[{type:'match', feild:'projectID', value:UserID}]
        }, undefined);
        let data:elasticsearchResponse<JoinRequest> = result.body;
        return data.hits.hits.map(single=>this.Factory.createItem(single._source));
    }
}