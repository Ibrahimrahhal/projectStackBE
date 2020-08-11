// const Joi = require('@hapi/joi');
// const userSchema =  Joi.object({
//     email: Joi.string().email().required(),
//     firstName: Joi.string(),
//     lastName:Joi.string(),
//     type:Joi.custom()
// });

const path = require('path');
const { prmosieBasedScan, prmosieBasedGetItem, prmosieBasedUpdateItem } = require(path.join(__dirname,'../util'));
const { tables } = require("../config");
const Project = require("./Project");
const Config = require('../config');
class User {
    email;
    firstName;
    lastName;
    userType;
    profileImage;
    skills;
    resume;
    interests;
    university;
    projects;
    summery;
    department;
    yearOfGrad;
    headline;

    static privateAttribute = ['userCompletedSignup'];
    constructor(user){
        for (const atrr in this)
            if(User.totalAttr[atrr])
                this[atrr] = user[atrr];
    }

    toDynamoDbObject(){
        let obj = {};
        Object.keys(User.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined)
                obj[key] = {
                    [User.totalAttr[key]]: User.toStringAtrr.includes(key)?JSON.stringify(this[key]):this[key]
                }
        });
        return obj;
    }
    static async getUser(email){
        let result =  await prmosieBasedGetItem({
                 Key:{
                     email:
                     { "S": email}
                 },
                 TableName: Config.tables.users
             });
         return User.fromDynamoDB(result.Item);
     }
    static fromDynamoDB(Item){
        let user = {}
        Object.keys(Item).forEach((key)=>{
            Object.keys(Item[key]).forEach((type)=>{
                user[key] = User.toStringAtrr.includes(key)?JSON.parse(Item[key][type]):Item[key][type];
            })
        });

        return new User(user);
    }

    static async all(){
        let results = await prmosieBasedScan({
            TableName: tables.users
        });
        let users = results.Items.map((item)=>{
            return this.fromDynamoDB(item);
        });
        return users;
    }

    async patch(){
        return await prmosieBasedUpdateItem({
            Key:{
                "email": {"S":this.email},
            },
            TableName: Config.tables.users,
            ...this.generatePutExprestions()
        });
    }

    toRegularObject(){
        let obj = {};
        Object.keys(User.totalAttr).forEach((key)=>{
            if(typeof this[key] != typeof undefined)
                obj[key] = this[key];
        });
        if(typeof obj.userType != typeof undefined)
            obj.userCompletedSignup = true;
        return obj; 
    }


    generatePutExprestions(){
        let UpdateExpression = 'set ', ExpressionAttributeValues = {};
        Object.keys(User.totalAttr).forEach((key)=>{
            if(key == "email")
                return;
            if(typeof this[key] != typeof undefined){
                let obj={};
                if(!ExpressionAttributeValues[`:${key[0]}`]){
                    UpdateExpression+= `${key} = :${key[0]} , `;
                    obj[User.totalAttr[key]] =  User.toStringAtrr.includes(key)?JSON.stringify(this[key]):this[key].toString();
                    ExpressionAttributeValues[`:${key[0]}`] = obj;
                }else{
                    UpdateExpression+= `${key} = :${key[1]} , `;
                    obj[User.totalAttr[key]]=  User.toStringAtrr.includes(key)?JSON.stringify(this[key]):this[key].toString()
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


    async getProjects(){
        let results = await prmosieBasedScan({
            ExpressionAttributeValues: {
                ":a": {
                  S: this.email
                 }
               }, 
            FilterExpression: "userID = :a",
            TableName: tables.projectUserTable
        });
        let projects = [];
        for (let index in results.Items)
            projects.push( await Project.getProject(results.Items[index].projectId.S));
        return projects;
    }

    static isUserVerfied(user){
        return  typeof user.userType != typeof undefined;
    }

    static shapeUserForPublicAccess(user){
        this.privateAttribute.forEach((att)=>{
            delete user[att];
        });
        return user;
    }
}


module.exports =  User;