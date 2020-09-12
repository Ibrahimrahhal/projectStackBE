import { 
    promiseBasedGetItem, 
    prmosieBasedScan, 
    prmosieBasedUpdateItem, 
    prmosieBasedPutItem,
    promiseBasedGetItems } from "../../util";
import Factory from "../../factories/factory";



export default abstract class DynamodbController<T>{

    abstract totalAttr:any;
    abstract toStringAtrr:Array<string>;
    abstract primaryKey:string;
    abstract dynamodbTable:string;
    abstract Factory:Factory<T>;



    protected toDynamodbObject(item:T):any{
        let obj:any = {};
        Object.keys(this.totalAttr).forEach((key)=>{
            if(typeof (item as any)[key] != typeof undefined)
                obj[key] = {
                    [this.totalAttr[key]]: this.convertKeyValueForDynamoDB(key, (item as any)[key])
                }
        });
        return obj;
    };

    protected convertKeyValueForDynamoDB(key:string, value:any):any{
        if(this.toStringAtrr.includes(key))
            return JSON.stringify(value);
        if(typeof value == 'boolean')
            return value;
        return (value || '').toString();
    }

    protected fromDynamodbObject(Item:any):T{    
        let obj:any = {}
        Object.keys(Item).forEach((key)=>{
            Object.keys(Item[key]).forEach((type)=>{
                obj[key] = this.toStringAtrr.includes(key)?JSON.parse(Item[key][type]):Item[key][type];
            })
        });

        return this.Factory.createItem(obj);
    };
    
    protected async getItem(primaryKey:string | Array<string>):Promise<T | Array<T>>{
    let result:any;
    let items:T | Array<T>;
    let isArray:boolean = primaryKey instanceof Array ;
    primaryKey = (isArray && primaryKey.length == 1) ? primaryKey[0] : primaryKey
    if(primaryKey instanceof Array){
        result = await promiseBasedGetItems({
            RequestItems:{
                [this.dynamodbTable]: {
                    Keys: primaryKey.map((key)=>{ return {[this.primaryKey]:{'S':key}}}),
                }}})
        items = result.Responses.ProjectStackAllProjects.map((item:any)=>{
            return this.fromDynamodbObject(item);
        });
    }else{
        result =  await promiseBasedGetItem({
            Key:{
                [this.primaryKey]:
                { "S": primaryKey}
            },
            TableName: this.dynamodbTable
        });
        items = isArray?[this.fromDynamodbObject(result.Item)]:this.fromDynamodbObject(result.Item);
    }

    return items;
         
     };


    protected async patchItem(Item:T):Promise<any>{
        return await prmosieBasedUpdateItem({
            Key:{
                [this.primaryKey]:
                { "S": (Item as any)[this.primaryKey]}
            },
            TableName: this.dynamodbTable,
            ...this.generatePutExprestions(Item)
        });
    };


    public async getAllItems():Promise<T[]>{
        let results:any = await prmosieBasedScan({
            TableName: this.dynamodbTable
        });
        let items:Array<T> = results.Items.map((item:any)=>{
            return this.fromDynamodbObject(item);
        });
        return items;
    };

    protected async insertItem(Item:T):Promise<any>{
        let results  = await prmosieBasedPutItem({
            Item: this.toDynamodbObject(Item),
            TableName: this.dynamodbTable
        });
        return results;
    }


    protected generatePutExprestions(item:T):any{
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
