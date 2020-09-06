"use strict";
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
            projectID: "S",
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
        let results = elasticSearchController_1.default.search(this.indexName, {
            filter: {
                userID
            }
        }, undefined);
    }
}
exports.default = ProjectEnrollmentController;
//# sourceMappingURL=projectEnrollmentController.js.map