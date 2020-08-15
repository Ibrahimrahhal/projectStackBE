import Config from '../../config';
import DynamodbController from './dynamodbController';
import ProjectsFactory from '../../factories/projectsFactory';
import Project from '../../schemas/project/project';

export default class ProjectController extends DynamodbController<Project>{
    static instance:ProjectController;

    totalAttr  = {
        ID: "S",
        projectName: "S",
        projectDesc: "S",
        isPublic: "BOOL",
        maxNumberOfMembers: "N",
        creatorEmail: "S",
        profEmail: "S",
        timeCreated: "N",
        projectType: "N",
        slogan:"S",
        tags:"S"
     };
    toStringAtrr = ['tags']
    primaryKey = "ID";
    dynamodbTable = Config.tables.projects;
    Factory = new ProjectsFactory();

    private constructor(){
        super();
    }

    static getInstance():ProjectController{
        if(ProjectController.instance)
            return ProjectController.instance;
        ProjectController.instance = new ProjectController();
        return ProjectController.getInstance();
    }


}
