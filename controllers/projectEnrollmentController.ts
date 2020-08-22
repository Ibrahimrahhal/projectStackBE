import User from "../schemas/user/user";
import Project from "../schemas/project/project";
import ProjectUserRelations from "../schemas/relations/ProjectEnrollment";
import ManyToMany from "./dynamodb/relations/many2many";
import Config from '../config';
import ProjectEnrollmentFactory from "../factories/projectUserRelationFactory";
import ProjectController from "./projectController";
import UserController from "./UserController";

export default class ProjectEnrollmentController extends ManyToMany<ProjectUserRelations, Project, User>{
    static instance:ProjectEnrollmentController;
    protected FirstEntityController:ProjectController;
    protected SecondEntityController:UserController;
    totalAttr  = {
        ID:"S",
        userID:"S",
        projectID:"S",
        timestamp:"N"
     };
     private ID:string;
     private userID:string;
     private projectId:string;
     private timestamp:number;
    toStringAtrr:Array<string> = []
    primaryKey = "ID";
    dynamodbTable = Config.tables.projectUserTable;
    Factory = new ProjectEnrollmentFactory();
}