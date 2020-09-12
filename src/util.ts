
import Config from './config';
import AWS from 'aws-sdk';
import CryptoJS from 'crypto-js';

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB({region:"us-east-1"});
import sha256 from 'sha256';

export function promiseBasedGetItem(param:any){
    return new Promise((resolve, reject)=>{
        dynamodb.getItem(param, (err, data)=>{
            if(err)
            reject(err)
            else
            resolve(data);
        })
    });
}

export function promiseBasedGetItems(params:any){
    return new Promise((resolve, reject)=>[
        dynamodb.batchGetItem(params,(err, data)=>{
            if(err)
                reject(err)
            else
                resolve(data); 
        })
    ])
}

export function promiseBasedQueryItem(params:any){
    return new Promise((resolve, reject)=>{
        dynamodb.query(params, (err, data)=>{
            if(err)
            reject(err);
            else
            resolve(data);
        })
    })
}


export function prmosieBasedPutItem(param:any){
    return new Promise((resolve, reject)=>{
        dynamodb.putItem(param, (err, data)=>{
            if(err)
            reject(err)
            else
            resolve(data);
        })
    });
}
export function prmosieBasedUpdateItem(param:any){
    return new Promise((resolve, reject)=>{
        dynamodb.updateItem(param, (err, data)=>{
            if(err)
            reject(err)
            else
            resolve(data);
        })
    });
}

export function prmosieBasedScan(param:any){
    return new Promise((resolve, reject)=>{
        dynamodb.scan(param, (err, data)=>{
            if(err)
            reject(err)
            else
            resolve(data);
        })
    });
}

export function prmosieBasedDeleteItem(param:any){
    return new Promise((resolve, reject)=>{
        dynamodb.deleteItem(param, (err, data)=>{
            if(err)
            reject(err)
            else
            resolve(data);
        })
    });
}

export function promiseBasedPutObject(params:any){

    return new Promise((resolve, reject)=>{
        s3.putObject(params, (err, result)=>{
            if(err)
            reject(err);
            else
            resolve(result)
        });
    })
}

export function hashFunction(value:string):string{
    return sha256(Config.hashSalt + value + sha256(Config.hashSalt));
}


export function encryptData(data:any){
    if(Config.disableEncryption)
        return data;
    if(typeof data == typeof 'string')
        return CryptoJS.AES.encrypt(data, Config.encryptKey).toString();
    else
        return CryptoJS.AES.encrypt(JSON.stringify(data), Config.encryptKey).toString();
}

export function decryptData(data:any){
    if(Config.disableEncryption)
        if(typeof data == typeof {})
            return JSON.stringify(data);
        else
            return data;
    return CryptoJS.AES.decrypt(data, Config.encryptKey).toString(CryptoJS.enc.Utf8);
}



export function getValueFromKeyInEncryptedObject(key:string, object:any){
    let returnVal;
    Object.keys(object).forEach((inkey)=>{
        if(module.exports.decryptData(inkey) == key)
        returnVal = object[inkey];
    });
    if(returnVal)
    return module.exports.decryptData(returnVal);
}

export function base64ToString(base64String:string){
    let buff = new Buffer(base64String, 'base64');
    return buff.toString('ascii');
}


export function GenerateRandomID():string{
        return sha256(Math.random().toString());
}


export async function asyncMap(array:Array<any>, callBack:any){
    array = array || [];
    let arrayToReturn = [];
    for(let i = 0; i < array.length; i++)
        arrayToReturn.push(await callBack(array[i]));
    return arrayToReturn;
}

