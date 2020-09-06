"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joinRequestFactory_1 = __importDefault(require("../factories/joinRequestFactory"));
const dynamodbController_1 = __importDefault(require("./dynamodb/dynamodbController"));
const config_1 = __importDefault(require("../config"));
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
    }
    static getInstance() {
        if (JoinRequestController.instance)
            return JoinRequestController.instance;
        JoinRequestController.instance = new JoinRequestController();
        return JoinRequestController.getInstance();
    }
}
exports.default = JoinRequestController;
//# sourceMappingURL=joinRequestsController.js.map