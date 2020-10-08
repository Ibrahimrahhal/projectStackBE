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
const config_1 = __importDefault(require("../config"));
const notificationsFactory_1 = __importDefault(require("../factories/notificationsFactory"));
const dynamodbController_1 = __importDefault(require("./dynamodb/dynamodbController"));
const elasticSearchController_1 = __importDefault(require("./elasticsearch/elasticSearchController"));
class NotificationsController extends dynamodbController_1.default {
    constructor() {
        super();
        this.totalAttr = {
            ID: "S",
            userID: "S",
            projectID: "S",
            RequestID: "S",
            read: "BOOL",
            timestamp: "N",
            type: "N",
        };
        this.toStringAtrr = [];
        this.primaryKey = "ID";
        this.dynamodbTable = config_1.default.tables.notificationsTable;
        this.Factory = new notificationsFactory_1.default();
        this.indexName = config_1.default.elasticsearch.indices.notification;
    }
    ;
    ;
    static getInstance() {
        if (NotificationsController.instance)
            return NotificationsController.instance;
        NotificationsController.instance = new NotificationsController();
        return NotificationsController.getInstance();
    }
    getItem(notificationID) {
        return super.getItem(notificationID);
    }
    patchItem(Item) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("patchItem").call(this, Item);
            yield elasticSearchController_1.default.PatchItem(this.indexName, Item.serializeAsJSON());
            return;
        });
    }
    insertItem(Item) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("insertItem").call(this, Item);
            yield elasticSearchController_1.default.insertItem(this.indexName, Item.serializeAsJSON());
            return;
        });
    }
    getAllNotificationsForUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield elasticSearchController_1.default.search(this.indexName, {
                filters: [{
                        type: 'match',
                        feild: 'userID',
                        value: userID
                    }]
            }, undefined);
            let body = response.body;
            return body.hits.hits.map((noti) => {
                return this.Factory.createItem(noti._source);
            });
        });
    }
}
exports.default = NotificationsController;
//# sourceMappingURL=NotificationsController.js.map