const { hashFunction } = require("../util");
const { prmosieBasedPutItem, prmosieBasedUpdateItem, prmosieBasedScan } = require('../util');
const Config = require('../config');

var notificationsTypes = {
    "projectInvitations":0,
    "projectJoinRequest":1,
    "projectInvitationAccepted":2,
    "projectInvitationRejected":3,
    "projectJoinRequestAccepted":4,
    "projectJoinRequestRejected":5
};

class Notification{
    ID;
    UserEmail;
    Type;
    RelatedUser;
    RelatedProject;
    Message;
    Opened;
    static totalAttr  = {
        ID: "S",
        UserEmail: "S",
        Type: "S",
        RelatedUser: "S",
        RelatedProject: "S",
        Message: "S",
        Opened: "BOOL"
    };
    static toStringAtrr = [];

    constructor(type, UserEmail, Message, RelatedUser, RelatedProject, notification){
        if(notification){
            for (const atrr in this)
            this[atrr] = (atrr in notification ? notification : this)[atrr];
            return;
        }
        this.Type = type;
        this.ID = hashFunction(type+UserEmail+(RelatedUser|| RelatedProject));
        this.UserEmail = UserEmail;
        this.Message = Message;
        this.RelatedUser = RelatedUser;
        this.RelatedProject = RelatedProject;
        this.Opened = false;
    }


    toDynamoDbObject(){
        let obj = {};
        Object.keys(Notification.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined)
                obj[key] = {
                    [Notification.totalAttr[key]]: Notification.toStringAtrr.includes(key)?JSON.stringify(this[key]):typeof this[key] != 'boolean'?this[key].toString():this[key]
                }
        });
        return obj;
    }


    static fromDynamoDB(Item){
        let notifi = {}
        Object.keys(Item).forEach((key)=>{
            Object.keys(Item[key]).forEach((type)=>{
                notifi[key] = Notification.toStringAtrr.includes(key)?JSON.parse(Item[key][type]):Item[key][type];
            })
        });
        return new Notification(null, null,null,null,null,notifi);
    }

    async put(){
        let result = await prmosieBasedPutItem({
            Item: this.toDynamoDbObject(),
            TableName: Config.tables.usersNotificationsTable
        });
        return result;
    }

    static async getAll(UserEmail){
        let params = {
            ExpressionAttributeValues: {
             ":UID": {
               S: UserEmail
              }
            }, 
            FilterExpression: "UserEmail = :UID", 
            TableName: Config.tables.usersNotificationsTable
           };
        let results = await prmosieBasedScan(params);
        let noti = results.Items.map((item)=>{
            return this.fromDynamoDB(item);
        });
        return noti || [];
    }

}


module.exports = {
    notificationsTypes,
    Notification
}