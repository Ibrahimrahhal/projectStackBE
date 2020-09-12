import ProjectJoinRequestNotification from "../schemas/notifications/projectJoinRequestNotification";
import JoinRequestAnsweredNotification from "../schemas/notifications/joinRequestAnswerdNotiffications";
import notifcationsEnums from "../schemas/notifications/notifcationsEnums";
import Notification from "../schemas/notifications/notification";
import UserJoinRequestToRelatedProjectNotification from "../schemas/notifications/userJoinRequestToRelatedProjectNotification";
import Factory from "./factory";

export default class NotificationsFactory extends Factory<Notification>{


    createItem(itemObject:any):Notification{

        switch (itemObject.type){
            case notifcationsEnums.JoinRequestAnsweredNotification:
                return new JoinRequestAnsweredNotification(itemObject.ID, itemObject.userID, itemObject.requestID, itemObject.read, itemObject.timestamp);

            case notifcationsEnums.ProjectJoinRequestNotification:
                return new ProjectJoinRequestNotification(itemObject.ID, itemObject.projectID, itemObject.userID, itemObject.requestID, itemObject.read, itemObject.timestamp);

            case notifcationsEnums.UserJoinRequestToRelatedProjectNotification:
                return new UserJoinRequestToRelatedProjectNotification(itemObject.ID, itemObject.projectID, itemObject.userID, itemObject.requestID, itemObject.read, itemObject.timestamp)
        }

    }


    createProjectJoinRequestNotification(projectID:string, userID:string, requestID:string):Notification{
        return new ProjectJoinRequestNotification(undefined, projectID, userID, requestID);
    }


    createUserJoinRequestNotification(projectID:string, userIDs:Array<string>, requestID:string):Array<Notification>{
        return userIDs.map(uid=>new UserJoinRequestToRelatedProjectNotification(undefined, projectID, uid, requestID));

    }




}