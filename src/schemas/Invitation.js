const { hashFunction } = require("../util");
const { prmosieBasedPutItem, prmosieBasedUpdateItem, prmosieBasedScan } = require('../util');
const Config = require('../config');

class Invitation {
    ID;
    UserID;
    ProjectID;
    SenderID;
    TimeCreated;
    Accepted;
    Rejected;
    AcceptRejectMSG;
    InvitationMSG;
    static totalAttr  = {
       ID: "S",
       UserID: "S",
       SenderID: "S",
       Accepted: "BOOL",
       Rejected: "BOOL",
       TimeCreated: "S",
       AcceptRejectMSG: "S",
       InvitationMSG: "S"
    };
    static toStringAtrr = [];
    constructor(projectID, userID, senderID, MSG, invite){
        if(invite){
        for (const atrr in this)
            this[atrr] = (atrr in invite ? invite : this)[atrr];
        return;
        }
        this.ID = hashFunction(projectID+senderID);
        this.ProjectID = projectID;
        this.SenderID = senderID;
        this.UserID = userID;
        this.Accepted = false;
        this.Rejected = false;
        this.TimeCreated = Date.now().toString();
        this.AcceptRejectMSG = MSG;
    }

    toDynamoDbObject(){
        let obj = {};
        Object.keys(Invitation.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined)
                obj[key] = {
                    [Invitation.totalAttr[key]]: Invitation.toStringAtrr.includes(key)?JSON.stringify(this[key]):typeof this[key] != 'boolean'?this[key].toString():this[key]
                }
        });
        return obj;
    }

    toRegularObject(){
        let obj = {};
        Object.keys(Invitation.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined)
                obj[key] = this[key];
        });
        return obj; 
    }

    static fromDynamoDB(Item){
        let invite = {}
        Object.keys(Item).forEach((key)=>{
            Object.keys(Item[key]).forEach((type)=>{
                invite[key] = Invitation.toStringAtrr.includes(key)?JSON.parse(Item[key][type]):Item[key][type];
            })
        });
        return new Invitation(null,null,null,null,invite);
    }

    static async getAll(userID){
        let params = {
            ExpressionAttributeValues: {
             ":UID": {
               S: userID
              }
            }, 
            FilterExpression: "UserID = :UID", 
            TableName: Config.tables.projectInvitations
           };
        let results = await prmosieBasedScan(params);
        let invs = results.Items.map((item)=>{
            return this.fromDynamoDB(item);
        });
        return invs || [];
    }

    static async getInvitations(ID){
        let result =  await prmosieBasedGetItem({
                 Key:{
                     ID:
                     { "S": ID}
                 },
                 TableName: Config.tables.projectInvitations
             });
         return Invitation.fromDynamoDB(result.Item);
     }


    verifyActions(userEmail){
        return this.UserID == userEmail;
    }



    async put(){
        let result = await prmosieBasedPutItem({
            Item: this.toDynamoDbObject(),
            TableName: Config.tables.projectInvitations
        });
        return result;
    }

    async accept(msg){
    let params = {
            ExpressionAttributeValues: {
             ":AC": {
               BOOL: true
              },
              ":MSG": {
                S:msg
            }
            }, 
            Key: {
             "ID": {
               S: this.ID
              }
            }, 
            TableName: Config.tables.projectInvitations, 
            UpdateExpression: "SET Accepted = :AC, AcceptRejectMSG = :MSG"
           };
        
        return await prmosieBasedUpdateItem(params);
    }

    async reject(msg){
    let params = {
            ExpressionAttributeValues: {
             ":RE": {
               BOOL: true
              },
              ":MSG": {
                  S:msg
              }
            }, 
            Key: {
             "ID": {
               S: this.ID
              }
            }, 
            TableName: Config.tables.projectInvitations, 
            UpdateExpression: "SET Rejected = :RE , AcceptRejectMSG = :MSG"
        };
        
        return await prmosieBasedUpdateItem(params);
    }

}

module.exports = Invitation;