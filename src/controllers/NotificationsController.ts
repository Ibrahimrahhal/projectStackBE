import { markWithMithMultipleUsers } from './../schemas/joinRequests/joinRequest';
import config from "../config";
import NotificationsFactory from "../factories/notificationsFactory";
import Notification from "../schemas/notifications/notification";
import DynamodbController from "./dynamodb/dynamodbController";
import Indexable from './elasticsearch/elasticsearch_indexable';
import ElasticsearchController from "./elasticsearch/elasticSearchController";
import elasticsearchResponse from "./elasticsearch/elasticsearch_response_body";

export default class NotificationsController extends DynamodbController<Notification> implements Indexable{
    static instance:NotificationsController;
    totalAttr:any = {
        ID: "S",
        userID: "S",
        projectID: "S",
        RequestID: "S",
        read: "BOOL",
        timestamp: "N",
        type:"N",
     };;
    toStringAtrr:Array<string> = [];;
    primaryKey:string = "ID";
    dynamodbTable:string = config.tables.notificationsTable;
    Factory:NotificationsFactory = new NotificationsFactory();
    indexName:string = config.elasticsearch.indices.notification;
     private constructor(){
         super();
     }

     static getInstance():NotificationsController{
        if(NotificationsController.instance)
            return NotificationsController.instance;
            NotificationsController.instance = new NotificationsController();
        return NotificationsController.getInstance();
    }


    getItem(notificationID:string | Array<string>):Promise<Notification | Notification[]>{
        return super.getItem(notificationID);
    }

    async patchItem(Item:Notification):Promise<void>{
        await super.patchItem(Item);
        await ElasticsearchController.PatchItem(this.indexName, Item.serializeAsJSON());
        return;
    }

    async insertItem(Item:Notification):Promise<void>{
        await super.insertItem(Item);
        await ElasticsearchController.insertItem(this.indexName, Item.serializeAsJSON());
        return;
    }


    async getAllNotificationsForUser(userID:string):Promise<Notification[]>{
        let response = await ElasticsearchController.search(this.indexName,{
            filters:[{
                type:'match',
                feild:'userID',
                value:userID
            }]
        }, undefined);

        let body:elasticsearchResponse<Notification> = response.body;
        return body.hits.hits.map((noti)=>{
            return this.Factory.createItem(noti);
        })
    }

    






}