import { prmosieBasedGetItem, prmosieBasedScan, prmosieBasedUpdateItem } from "../../util";
import Factory from "../../factories/factory";



export default abstract class DynamodbController<T>{

    abstract totalAttr:any;
    abstract toStringAtrr:Array<string>;
    abstract primaryKey:string;
    abstract dynamodbTable:string;
    abstract Factory:Factory<T>;



    toDynamodbObject(item:T):any{
        let obj:any = {};
        Object.keys(this.totalAttr).forEach((key)=>{
            if(typeof (item as any)[key] != typeof undefined)
                obj[key] = {
                    [this.totalAttr[key]]: this.convertKeyValueForDynamoDB(key, (item as any)[key])
                }
        });
        return obj;
    };

    convertKeyValueForDynamoDB(key:string, value:any):any{
        if(this.toStringAtrr.includes(key))
            return JSON.stringify(value);
        if(typeof value == 'boolean')
            return value;
        return (value || '').toString();
    }

    fromDynamodbObject(Item:any):T{
        let obj:any = {}
        Object.keys(Item).forEach((key)=>{
            Object.keys(Item[key]).forEach((type)=>{
                obj[key] = this.toStringAtrr.includes(key)?JSON.parse(Item[key][type]):Item[key][type];
            })
        });

        return this.Factory.createItem(obj);
    };
    
    async getItem(primaryKey:string):Promise<T>{
        let result:any =  await prmosieBasedGetItem({
                 Key:{
                     [this.primaryKey]:
                     { "S": primaryKey}
                 },
                 TableName: this.dynamodbTable
             });
         return this.fromDynamodbObject(result.Item);
     };


    async patchItem(Item:T):Promise<any>{
        return await prmosieBasedUpdateItem({
            Key:{
                [this.primaryKey]:
                { "S": (Item as any)[this.primaryKey]}
            },
            TableName: this.dynamodbTable,
            ...this.generatePutExprestions(Item)
        });
    };


    async getAllItems():Promise<T[]>{
        let results:any = await prmosieBasedScan({
            TableName: this.dynamodbTable
        });
        let items:Array<T> = results.Items.map((item:any)=>{
            return this.fromDynamodbObject(item);
        });
        return items;
    };


    generatePutExprestions(item:T):any{
        let UpdateExpression = 'set ', ExpressionAttributeValues:any = {};
        Object.keys(this.totalAttr).forEach((key)=>{
            if(key == "email")
                return;
            if(typeof (item as any)[key] != typeof undefined){
                let obj:any={};
                if(!ExpressionAttributeValues[`:${key[0]}`]){
                    UpdateExpression+= `${key} = :${key[0]} , `;
                    obj[this.totalAttr[key]] =  this.toStringAtrr.includes(key)?JSON.stringify((item as any)[key]):(item as any)[key].toString();
                    ExpressionAttributeValues[`:${key[0]}`] = obj;
                }else{
                    UpdateExpression+= `${key} = :${key[1]} , `;
                    obj[this.totalAttr[key]]=  this.toStringAtrr.includes(key)?JSON.stringify((item as any)[key]):(item as any)[key].toString()
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
