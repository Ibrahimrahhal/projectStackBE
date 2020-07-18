const { encryptData, decryptData, getValueFromKeyInEncryptedObject, prmosieBasedPutItem,  hashFunction, prmosieBasedGetItem, prmosieBasedScan } = require('../util');
const Config = require('../config');
class Project{
    ID;
    projectName;
    projectDesc;
    isPublic;
    maxNumberOfMembers;
    creatorEmail;
    profEmail;
    timeCreated;
    projectType;
    members;
    slogan;
    tags;
    static totalAttr  = {
       ID: "S",
       projectName: "S",
       projectDesc: "S",
       isPublic: "BOOL",
       maxNumberOfMembers: "N",
       creatorEmail: "S",
       profEmail: "S",
       timeCreated: "N",
       projectType: "N",
       slogan:"S",
       tags:"S"
    };
    static toStringAtrr = ['tags']
    constructor(project){
        for (const atrr in this)
            this[atrr] = (atrr in project ? project : this)[atrr];
        if(!this.ID)
            this.ID = hashFunction(Date.now().toString()).substring(0,8);
    }

    toDynamoDbObject(){
        let obj = {};
        Object.keys(Project.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined)
                obj[key] = {
                    [Project.totalAttr[key]]: Project.toStringAtrr.includes(key)?JSON.stringify(this[key]):typeof this[key] != 'boolean'?this[key].toString():this[key]
                }
        });
        return obj;
    }

    static fromDynamoDB(Item){
        let project = {}
        Object.keys(Item).forEach((key)=>{
            Object.keys(Item[key]).forEach((type)=>{
                project[key] = Project.toStringAtrr.includes(key)?JSON.parse(Item[key][type]):Item[key][type];
            })
        });
        return new Project(project);
    }

    static async getProject(ID){
       let result =  await prmosieBasedGetItem({
                Key:{
                    ID:
                    { "S": ID}
                },
                TableName: Config.tables.projects
            });
        return Project.fromDynamoDB(result.Item);
    }

    async loadMembers(){
    this.members = [];
    let results = await prmosieBasedScan({
        ExpressionAttributeValues: {
            ":a": {
              S: this.ID
             }
           }, 
        FilterExpression: "projectId = :a",
        TableName: Config.tables.projectUserTable
    });
    for(let Item of results.Items){
        this.members.push(Item.userID.S);
    }
    return this.members;
    }

    toRegularObject(){
        let obj = {};
        Object.keys(Project.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined)
                obj[key] = this[key];
        });
        if(this.members)
            obj.members = this.members;
        return obj; 
    }

    isUserHasPrem(userEmail){
        return (userEmail == this.creatorEmail || userEmail == this.profEmail)
    }


    generatePutExprestions(){
        let UpdateExpression = 'set ', ExpressionAttributeValues = {};
        Object.keys(Project.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined){
                let obj={};
                if(!ExpressionAttributeValues[`:${key[0]}`]){
                    UpdateExpression+= `${key} = :${key[0]} , `;
                    obj[Project.totalAttr[key]] =  this[key].toString();
                    ExpressionAttributeValues[`:${key[0]}`] = obj;
                }else{
                    UpdateExpression+= `${key} = :${key[1]} , `;
                    obj[Project.totalAttr[key]] =  this[key].toString()
                    ExpressionAttributeValues[`:${key[1]}`] = obj;
                }
            }
        });
        UpdateExpression = UpdateExpression.substring(0,UpdateExpression.length-3)
        return {
            UpdateExpression,
            ExpressionAttributeValues
        }
    }
    async addMember(userEmail){
        let relID = hashFunction(this.ID+userEmail);
        let timeCreated = Date.now().toString();
        let result = await prmosieBasedPutItem({
            Item:{
                ID: {"S": relID},
                userID: {"S": userEmail},
                projectId: {"S": this.ID},
                timeCreated: {"S": timeCreated}
            },
            TableName: Config.tables.projectUserTable
        });
    }

    static async all(){
        let results = await prmosieBasedScan({
            TableName: Config.tables.projects
        });
        let projects = results.Items.map((item)=>{
            return this.fromDynamoDB(item);
        });
        return projects;
    }

    async invite(userID){
         
        let result = await prmosieBasedPutItem({
            Item: project.toDynamoDbObject(),
            TableName: Config.tables.projectInvitations
        });
    }
}

module.exports = Project;