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
const many2many_1 = __importDefault(require("./dynamodb/relations/many2many"));
const config_1 = __importDefault(require("../config"));
const projectEnrollmentsFactory_1 = __importDefault(require("../factories/projectEnrollmentsFactory"));
const projectController_1 = __importDefault(require("./projectController"));
const UserController_1 = __importDefault(require("./UserController"));
const elasticSearchController_1 = __importDefault(require("./elasticsearch/elasticSearchController"));
class ProjectEnrollmentController extends many2many_1.default {
    constructor() {
        super();
        this.totalAttr = {
            ID: "S",
            userID: "S",
            projectId: "S",
            timestamp: "N",
            isAdmin: "BOOL"
        };
        this.toStringAtrr = [];
        this.primaryKey = "ID";
        this.dynamodbTable = config_1.default.tables.projectUserTable;
        this.indexName = config_1.default.elasticsearch.indices.projectsEnrollments;
        this.Factory = new projectEnrollmentsFactory_1.default();
        this.FirstEntityController = projectController_1.default.getInstance();
        this.SecondEntityController = UserController_1.default.getInstance();
    }
    static getInstance() {
        if (ProjectEnrollmentController.instance)
            return ProjectEnrollmentController.instance;
        ProjectEnrollmentController.instance = new ProjectEnrollmentController();
        return ProjectEnrollmentController.getInstance();
    }
    getProjectsOfUsers(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            let projectEnrollmentsSearch = yield elasticSearchController_1.default.search(this.indexName, {
                filters: [{
                        type: 'match',
                        feild: 'userID',
                        value: userID
                    }],
                sort: [{
                        feild: 'timestamp'
                    }]
            }, undefined);
            if (projectEnrollmentsSearch.statusCode !== 200)
                return [];
            let response = projectEnrollmentsSearch.body;
            let [projectIDs, isAdminArray] = response.hits.hits.map(x => {
                return this.Factory.createItem(x._source);
            }).map(projectEnroll => {
                return [projectEnroll.getProjectID(), projectEnroll.getIsAdmin()];
            }).reduce((rev, current) => {
                rev[0].push(current[0]);
                rev[1].push(current[1]);
                return rev;
            }, [[], []]);
            return (yield this.FirstEntityController.getItem(projectIDs)).map((project, index) => {
                return {
                    project,
                    extras: {
                        isAdmin: isAdminArray[index]
                    }
                };
            });
        });
    }
    getMembersOfProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.SecondEntityController.getItem(yield this.getMemberIDSOfProject(projectId)));
        });
    }
    addMemberToProject(enrollemnt) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("insertItem").call(this, enrollemnt);
            yield elasticSearchController_1.default.insertItem(this.indexName, enrollemnt.serializeAsJSON());
            return;
        });
    }
    getMemberIDSOfProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let projectEnrollmentsSearch = yield elasticSearchController_1.default.search(this.indexName, {
                filters: [{
                        type: 'match',
                        feild: 'projectId',
                        value: projectId
                    }]
            }, undefined);
            if (projectEnrollmentsSearch.statusCode !== 200)
                return [];
            let response = projectEnrollmentsSearch.body;
            let userIDs = response.hits.hits.map(x => {
                return this.Factory.createItem(x._source);
            }).map(projectEnroll => {
                return projectEnroll.getUserID();
            });
            return userIDs;
        });
    }
}
exports.default = ProjectEnrollmentController;
//# sourceMappingURL=projectEnrollmentController.js.map