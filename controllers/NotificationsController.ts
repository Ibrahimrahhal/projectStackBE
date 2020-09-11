import config from "../config";
import NotificationsFactory from "../factories/notificationsFactory";
import Notification from "../schemas/notifications/notification";
import DynamodbController from "./dynamodb/dynamodbController";
import Indexable from './elasticsearch/elasticsearch_indexable';
export default class NotificationsController extends DynamodbController<Notification> implements Indexable{
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
}