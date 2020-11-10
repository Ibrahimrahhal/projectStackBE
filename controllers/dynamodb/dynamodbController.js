"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
class DynamodbController {
    toDynamodbObject(item) {
        let obj = {};
        Object.keys(this.totalAttr).forEach((key) => {
            if (typeof item[key] != typeof undefined)
                obj[key] = {
                    [this.totalAttr[key]]: this.convertKeyValueForDynamoDB(key, item[key])
                };
        });
        return obj;
    }
    ;
    convertKeyValueForDynamoDB(key, value) {
        if (this.toStringAtrr.includes(key))
            return JSON.stringify(value);
        if (typeof value == 'boolean')
            return value;
        return (value || '').toString();
    }
    fromDynamodbObject(Item) {
        let obj = {};
        Object.keys(Item).forEach((key) => {
            Object.keys(Item[key]).forEach((type) => {
                obj[key] = this.toStringAtrr.includes(key) ? JSON.parse(Item[key][type]) : Item[key][type];
            });
        });
        return this.Factory.createItem(obj);
    }
    ;
    getItem(primaryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            let items;
            let isArray = primaryKey instanceof Array;
            primaryKey = (isArray && primaryKey.length == 1) ? primaryKey[0] : primaryKey;
            if (primaryKey instanceof Array) {
                result = yield util_1.promiseBasedGetItems({
                    RequestItems: {
                        [this.dynamodbTable]: {
                            Keys: primaryKey.map((key) => { return { [this.primaryKey]: { 'S': key } }; }),
                        }
                    }
                });
                items = result.Responses.ProjectStackAllProjects.map((item) => {
                    return this.fromDynamodbObject(item);
                });
            }
            else {
                result = yield util_1.promiseBasedGetItem({
                    Key: {
                        [this.primaryKey]: { "S": primaryKey }
                    },
                    TableName: this.dynamodbTable
                });
                items = isArray ? [this.fromDynamodbObject(result.Item)] : this.fromDynamodbObject(result.Item);
            }
            return items;
        });
    }
    ;
    patchItem(Item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield util_1.prmosieBasedUpdateItem(Object.assign({ Key: {
                    [this.primaryKey]: { "S": Item[this.primaryKey] }
                }, TableName: this.dynamodbTable }, this.generatePutExprestions(Item)));
        });
    }
    ;
    getAllItems() {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield util_1.prmosieBasedScan({
                TableName: this.dynamodbTable
            });
            let items = results.Items.map((item) => {
                return this.fromDynamodbObject(item);
            });
            return items;
        });
    }
    ;
    insertItem(Item) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield util_1.prmosieBasedPutItem({
                Item: this.toDynamodbObject(Item),
                TableName: this.dynamodbTable
            });
            return results;
        });
    }
    generatePutExprestions(item) {
        let UpdateExpression = 'set ', ExpressionAttributeValues = {};
        Object.keys(this.totalAttr).forEach((key) => {
            if (key == "email")
                return;
            if (typeof item[key] != typeof undefined) {
                let obj = {};
                if (!ExpressionAttributeValues[`:${key[0]}`]) {
                    UpdateExpression += `${key} = :${key[0]} , `;
                    obj[this.totalAttr[key]] = this.toStringAtrr.includes(key) ? JSON.stringify(item[key]) : item[key].toString();
                    ExpressionAttributeValues[`:${key[0]}`] = obj;
                }
                else {
                    UpdateExpression += `${key} = :${key[1]} , `;
                    obj[this.totalAttr[key]] = this.toStringAtrr.includes(key) ? JSON.stringify(item[key]) : item[key].toString();
                    ExpressionAttributeValues[`:${key[1]}`] = obj;
                }
            }
        });
        UpdateExpression = UpdateExpression.substring(0, UpdateExpression.length - 3);
        return {
            UpdateExpression,
            ExpressionAttributeValues
        };
    }
    ;
}
exports.default = DynamodbController;
//# sourceMappingURL=dynamodbController.js.map