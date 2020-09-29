"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const s3 = new aws_sdk_1.default.S3();
const dynamodb = new aws_sdk_1.default.DynamoDB({ region: "us-east-1" });
const sha256_1 = __importDefault(require("sha256"));
function promiseBasedGetItem(param) {
    return new Promise((resolve, reject) => {
        dynamodb.getItem(param, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
exports.promiseBasedGetItem = promiseBasedGetItem;
function promiseBasedGetItems(params) {
    return new Promise((resolve, reject) => [
        dynamodb.batchGetItem(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        })
    ]);
}
exports.promiseBasedGetItems = promiseBasedGetItems;
function promiseBasedQueryItem(params) {
    return new Promise((resolve, reject) => {
        dynamodb.query(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
exports.promiseBasedQueryItem = promiseBasedQueryItem;
function prmosieBasedPutItem(param) {
    return new Promise((resolve, reject) => {
        dynamodb.putItem(param, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
exports.prmosieBasedPutItem = prmosieBasedPutItem;
function prmosieBasedUpdateItem(param) {
    return new Promise((resolve, reject) => {
        dynamodb.updateItem(param, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
exports.prmosieBasedUpdateItem = prmosieBasedUpdateItem;
function prmosieBasedScan(param) {
    return new Promise((resolve, reject) => {
        dynamodb.scan(param, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
exports.prmosieBasedScan = prmosieBasedScan;
function prmosieBasedDeleteItem(param) {
    return new Promise((resolve, reject) => {
        dynamodb.deleteItem(param, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
exports.prmosieBasedDeleteItem = prmosieBasedDeleteItem;
function promiseBasedPutObject(params) {
    return new Promise((resolve, reject) => {
        s3.putObject(params, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}
exports.promiseBasedPutObject = promiseBasedPutObject;
function hashFunction(value) {
    return sha256_1.default(config_1.default.hashSalt + value + sha256_1.default(config_1.default.hashSalt));
}
exports.hashFunction = hashFunction;
function encryptData(data) {
    if (config_1.default.disableEncryption)
        return data;
    if (typeof data == typeof 'string')
        return crypto_js_1.default.AES.encrypt(data, config_1.default.encryptKey).toString();
    else
        return crypto_js_1.default.AES.encrypt(JSON.stringify(data), config_1.default.encryptKey).toString();
}
exports.encryptData = encryptData;
function decryptData(data) {
    if (config_1.default.disableEncryption)
        if (typeof data == typeof {})
            return JSON.stringify(data);
        else
            return data;
    return crypto_js_1.default.AES.decrypt(data, config_1.default.encryptKey).toString(crypto_js_1.default.enc.Utf8);
}
exports.decryptData = decryptData;
function getValueFromKeyInEncryptedObject(key, object) {
    let returnVal;
    Object.keys(object).forEach((inkey) => {
        if (module.exports.decryptData(inkey) == key)
            returnVal = object[inkey];
    });
    if (returnVal)
        return module.exports.decryptData(returnVal);
}
exports.getValueFromKeyInEncryptedObject = getValueFromKeyInEncryptedObject;
function base64ToString(base64String) {
    let buff = new Buffer(base64String, 'base64');
    return buff.toString('ascii');
}
exports.base64ToString = base64ToString;
function GenerateRandomID() {
    return sha256_1.default(Math.random().toString());
}
exports.GenerateRandomID = GenerateRandomID;
function asyncMap(array, callBack) {
    return __awaiter(this, void 0, void 0, function* () {
        array = array || [];
        let arrayToReturn = [];
        for (let i = 0; i < array.length; i++)
            arrayToReturn.push(yield callBack(array[i]));
        return arrayToReturn;
    });
}
exports.asyncMap = asyncMap;
//# sourceMappingURL=util.js.map