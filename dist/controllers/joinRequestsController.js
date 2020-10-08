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
const joinRequestFactory_1 = __importDefault(require("../factories/joinRequestFactory"));
const dynamodbController_1 = __importDefault(require("./dynamodb/dynamodbController"));
const config_1 = __importDefault(require("../config"));
const elasticSearchController_1 = __importDefault(require("./elasticsearch/elasticSearchController"));
const elasticSearchController_2 = __importDefault(require("./elasticsearch/elasticSearchController"));
const joinRequestsTypes_1 = __importDefault(require("../schemas/joinRequests/joinRequestsTypes"));
class JoinRequestController extends dynamodbController_1.default {
    constructor() {
        super();
        this.totalAttr = {
            ID: "S",
            userID: "S",
            projectID: "S",
            message: "S",
            accepted: "BOOL",
            rejected: "BOOL",
            rejectionMessage: "S",
            acceptionMessage: "S",
            timestamp: "N",
            type: "N",
            actionDoneBy: "S"
        };
        this.toStringAtrr = [];
        this.primaryKey = "ID";
        this.dynamodbTable = config_1.default.tables.projectJoinRequest;
        this.Factory = new joinRequestFactory_1.default();
        this.indexName = config_1.default.elasticsearch.indices.joinRequests;
    }
    static getInstance() {
        if (JoinRequestController.instance)
            return JoinRequestController.instance;
        JoinRequestController.instance = new JoinRequestController();
        return JoinRequestController.getInstance();
    }
    insertItem(request) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("insertItem").call(this, request);
            console.log(JSON.stringify(request.serializeAsJSON()));
            yield elasticSearchController_1.default.insertItem(this.indexName, request.serializeAsJSON());
        });
    }
    getItem(ID) {
        return super.getItem(ID);
    }
    patchItem(Item) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("patchItem").call(this, Item);
            yield elasticSearchController_1.default.PatchItem(this.indexName, Item.serializeAsJSON());
            return;
        });
    }
    getInvitaionsForUser(UserID) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield elasticSearchController_2.default.search(this.indexName, {
                filters: [
                    { type: 'match', feild: 'userID', value: UserID },
                    { type: 'match', feild: 'type', value: joinRequestsTypes_1.default.ProjectJoinRequest },
                    { type: 'match', feild: 'accepted', value: false },
                    { type: 'match', feild: 'rejected', value: false }
                ]
            }, undefined);
            let data = result.body;
            return data.hits.hits.map(single => this.Factory.createItem(single._source));
        });
    }
    getRequestsForProject(projectID) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield elasticSearchController_2.default.search(this.indexName, {
                filters: [
                    { type: 'match', feild: 'projectID', value: projectID },
                    { type: 'match', feild: 'type', value: joinRequestsTypes_1.default.UserJoinRequest },
                    { type: 'match', feild: 'accepted', value: false },
                    { type: 'match', feild: 'rejected', value: false }
                ]
            }, undefined);
            let data = result.body;
            return data.hits.hits.map(single => this.Factory.createItem(single._source));
        });
    }
    getItemCheap(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = (yield elasticSearchController_2.default.GetItem(this.indexName, ID)).body;
            return this.Factory.createItem(res._source);
        });
    }
}
exports.default = JoinRequestController;
//# sourceMappingURL=joinRequestsController.js.map