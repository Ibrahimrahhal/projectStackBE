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
const projectsFactory_1 = __importDefault(require("../factories/projectsFactory"));
const elasticSearchController_1 = __importDefault(require("./elasticsearch/elasticSearchController"));
class ProjectController extends dynamodbController_1.default {
    constructor() {
        super();
        this.totalAttr = {
            ID: "S",
            projectName: "S",
            projectDesc: "S",
            isPublic: "BOOL",
            maxNumberOfMembers: "N",
            creatorEmail: "S",
            profEmail: "S",
            timeCreated: "N",
            projectType: "N",
            slogan: "S",
            tags: "S"
        };
        this.toStringAtrr = ['tags'];
        this.primaryKey = "ID";
        this.dynamodbTable = config_1.default.tables.projects;
        this.Factory = new projectsFactory_1.default();
        this.indexName = config_1.default.elasticsearch.indices.projects;
    }
    static getInstance() {
        if (ProjectController.instance)
            return ProjectController.instance;
        ProjectController.instance = new ProjectController();
        return ProjectController.getInstance();
    }
    Search(SearchObject) {
        return new Promise(X => X);
    }
    getItem(projectID) {
        return super.getItem(projectID);
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
}
exports.default = ProjectController;
//# sourceMappingURL=projectController.js.map