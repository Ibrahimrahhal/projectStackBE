const { privateAttribute } = require("../../schemas/user");


//abstract class
class DynamodbController{
    static totalAttr;
    static toStringAtrr;
    static primaryKey;
    static dynamodbTable;
    static instance;
    constructor(firstInit){
        if(firstInit)
            throw new Error("this is a singleton class");
    }

    getClassOfThisObject = ()=>{
        return DynamodbController;
    }

    toDynamodbObject = (item)=>{
        let obj = {};
        Object.keys(this.getClassOfThisObject().totalAttr).forEach((key)=>{
            if(typeof item[key] != typeof undefined)
                obj[key] = {
                    [this.getClassOfThisObject().totalAttr[key]]: this.getClassOfThisObject().toStringAtrr.includes(key)?JSON.stringify(item[key]):item[key]
                }
        });
        return obj;
    };

    fromDynamodbObject = (Item)=>{
        let obj = {}
        Object.keys(Item).forEach((key)=>{
            Object.keys(Item[key]).forEach((type)=>{
                obj[key] = thi.getClassOfThisObject().toStringAtrr.includes(key)?JSON.parse(Item[key][type]):Item[key][type];
            })
        });

        return obj;
    };
    
    getItem = (primaryKey)=>{
        let result =  await prmosieBasedGetItem({
                 Key:{
                     [this.getClassOfThisObject().primaryKey]:
                     { "S": primaryKey}
                 },
                 TableName: this.getClassOfThisObject().dynamodbTable
             });
         return this.fromDynamoDB(result.Item);
     };
    patchItem;
    getAllItems = ()=>{
        let results = await prmosieBasedScan({
            TableName: this.getClassOfThisObject().dynamodbTable
        });
        let items = results.Items.map((item)=>{
            return this.fromDynamoDB(item);
        });
        return items;
    };


    generatePutExprestions = () => {
        let UpdateExpression = 'set ', ExpressionAttributeValues = {};
        Object.keys(this.getClassOfThisObject().totalAttr).forEach((key)=>{
            if(key == "email")
                return;
            if(typeof this[key] != typeof undefined){
                let obj={};
                if(!ExpressionAttributeValues[`:${key[0]}`]){
                    UpdateExpression+= `${key} = :${key[0]} , `;
                    obj[this.getClassOfThisObject().totalAttr[key]] =  this.getClassOfThisObject().toStringAtrr.includes(key)?JSON.stringify(this[key]):this[key].toString();
                    ExpressionAttributeValues[`:${key[0]}`] = obj;
                }else{
                    UpdateExpression+= `${key} = :${key[1]} , `;
                    obj[this.getClassOfThisObject().totalAttr[key]]=  this.getClassOfThisObject().toStringAtrr.includes(key)?JSON.stringify(this[key]):this[key].toString()
                    ExpressionAttributeValues[`:${key[1]}`] = obj;
                }
            }
        });
        UpdateExpression = UpdateExpression.substring(0,UpdateExpression.length-3)
        return {
            UpdateExpression,
            ExpressionAttributeValues
        }
    };

}

module.exports = DynamodbController;
