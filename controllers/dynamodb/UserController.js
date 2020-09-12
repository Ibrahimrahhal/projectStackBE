"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const dynamodbController_1 = __importDefault(require("./dynamodbController"));
const usersFactory_1 = __importDefault(require("../../factories/usersFactory"));
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
        this.Factory = new usersFactory_1.default();
    }
    static getInstance() {
        if (UserController.instance)
            return UserController.instance;
        UserController.instance = new UserController();
        return UserController.getInstance();
    }
}
module.exports = UserController;
//# sourceMappingURL=UserController.js.map