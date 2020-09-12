"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const dynamodbController_1 = __importDefault(require("./dynamodbController"));
const projectsFactory_1 = __importDefault(require("../../factories/projectsFactory"));
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
    }
    static getInstance() {
        if (ProjectController.instance)
            return ProjectController.instance;
        ProjectController.instance = new ProjectController();
        return ProjectController.getInstance();
    }
}
exports.default = ProjectController;
//# sourceMappingURL=projectController.js.map