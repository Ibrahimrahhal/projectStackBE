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
const dynamodbController_1 = __importDefault(require("./dynamodb/dynamodbController"));
const usersFactory_1 = __importDefault(require("../factories/usersFactory"));
const elasticSearchController_1 = __importDefault(require("../controllers/elasticsearch/elasticSearchController"));
class UserController extends dynamodbController_1.default {
    constructor() {
        super();
        this.totalAttr = {
            email: 'S',
            firstName: 'S',
            lastName: 'S',
            userType: 'N',
            profileImage: 'S',
            skills: 'S',
            resume: 'S',
            interests: 'S',
            university: 'N',
            department: 'N',
            yearOfGrad: 'N',
            headline: 'S',
            projects: 'S',
            summery: 'S'
        };
        this.toStringAtrr = ['skills', 'interests'];
        this.primaryKey = "email";
        this.dynamodbTable = config_1.default.tables.users;
        this.indexName = config_1.default.elasticsearch.indices.users;
        this.Factory = new usersFactory_1.default();
    }
    static getInstance() {
        if (UserController.instance)
            return UserController.instance;
        UserController.instance = new UserController();
        return UserController.getInstance();
    }
    Search(SearchObject, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let search = {
                filters: [],
                matchers: [],
                exists: ['userType'],
            };
            let filters = ['department', 'interests', 'skills', 'university'];
            let matchers = ['keyword'];
            filters.forEach((prop) => {
                if (!SearchObject[prop] || SearchObject[prop] === '' || SearchObject[prop].length === 0)
                    return;
                search.filters.push({
                    type: (SearchObject[prop] instanceof Array) ? 'match' : 'term',
                    feild: prop,
                    value: SearchObject[prop]
                });
            });
            matchers.forEach((prop) => {
                if (!SearchObject[prop] || SearchObject[prop] === '' || SearchObject[prop].length === 0)
                    return;
                ['firstName', 'lastName', 'headline', 'summery'].forEach((x) => {
                    search.matchers.push({
                        type: 'match',
                        feild: x,
                        value: SearchObject[prop]
                    });
                });
            });
            let result = (yield elasticSearchController_1.default.search(this.indexName, search, SearchObject.page)).body;
            return {
                results: result.hits.hits.map((res) => this.Factory.createItem(res._source)),
                pages: Math.ceil(result.hits.total.value / config_1.default.elasticsearch.searchPageSize)
            };
            return;
        });
    }
    patch(object) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = this.Factory.createItem(object);
            yield this.patchItem(object);
            yield elasticSearchController_1.default.PatchItem(this.indexName, user.serializeAsJSON(), user.serializeAsJSON().email);
        });
    }
    getItem(primaryKey) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("getItem").call(this, primaryKey);
        });
    }
    getItemCheap(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = (yield elasticSearchController_1.default.GetItem(this.indexName, ID)).body;
            return this.Factory.createItem(res._source);
        });
    }
}
exports.default = UserController;
module.exports = UserController;
//# sourceMappingURL=UserController.js.map