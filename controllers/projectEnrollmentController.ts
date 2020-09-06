import User from "../schemas/user/user";
import Project from "../schemas/project/project";
import ProjectEnrollmentRelations from "../schemas/relations/ProjectEnrollment";
import ManyToMany from "./dynamodb/relations/many2many";
import Config from '../config';
import ProjectEnrollmentFactory from "../factories/projectEnrollmentsFactory";
import ProjectController from "./projectController";
import UserController from "./UserController";
import Indexable from "./elasticsearch/elasticsearch_indexable";
import Elasticsearch from './elasticsearch/elasticSearchController'; 
import elasticsearchResponse from "./elasticsearch/elasticsearch_response_body";
import ProjectUserRelations from "../schemas/relations/ProjectEnrollment";
export default class ProjectEnrollmentController extends ManyToMany<ProjectEnrollmentRelations, Project, User> implements Indexable{
    static instance:ProjectEnrollmentController;
    protected FirstEntityController:ProjectController;
    protected SecondEntityController:UserController;
    totalAttr  = {
        ID:"S",
        userID:"S",
        projectID:"S",
        timestamp:"N",
        isAdmin:"BOOL"
     };
    toStringAtrr:Array<string> = []
    primaryKey = "ID";
    dynamodbTable = Config.tables.projectUserTable;
    indexName = Config.elasticsearch.indices.projectsEnrollments;
    Factory = new ProjectEnrollmentFactory();



    private constructor(){
        super();
        this.FirstEntityController = ProjectController.getInstance();
        this.SecondEntityController = UserController.getInstance();
    }


    static getInstance():ProjectEnrollmentController{
        if(ProjectEnrollmentController.instance)
            return ProjectEnrollmentController.instance;
            ProjectEnrollmentController.instance = new ProjectEnrollmentController();
        return ProjectEnrollmentController.getInstance();
    }

    public async getProjectsOfUsers(userID:string):Promise<Project[]>{
        let projectEnrollmentsSearch = await Elasticsearch.search(this.indexName, {
            filter:[{
                type:'match',
                feild:'userID',
                value: userID
            }]
        }, undefined);

        if(projectEnrollmentsSearch.statusCode !== 200)
            return [];
        
        let response:elasticsearchResponse<ProjectEnrollmentRelations> = projectEnrollmentsSearch.body;
        let projectIDs = response.hits.hits.map(x=>{
            return this.Factory.createItem(x._source);
        }).map(projectEnroll=>{
            return projectEnroll.getProjectID()
        });

        return  (await this.FirstEntityController.getItem(projectIDs)) as  Project[];
    }

    public async getMembersOfProject(projectId:string):Promise<User[]>{
        let projectEnrollmentsSearch = await Elasticsearch.search(this.indexName, {
            filter:[{
                type:'match',
                feild:'projectId',
                value: projectId
            }]
        }, undefined);

        if(projectEnrollmentsSearch.statusCode !== 200)
            return [];
        
        let response:elasticsearchResponse<ProjectEnrollmentRelations> = projectEnrollmentsSearch.body;
        let userIDs = response.hits.hits.map(x=>{
            return this.Factory.createItem(x._source);
        }).map(projectEnroll=>{
            return projectEnroll.getUserID()
        });
        if(userIDs.length == 0)
            return [];
        return  (await this.SecondEntityController.getItem(userIDs)) as  User[];
    }

    public async addMemberToProject( enrollemnt:ProjectUserRelations ):Promise<void>{
        await super.insertItem(enrollemnt);
        await Elasticsearch.insertItem(this.indexName, enrollemnt.serializeAsJSON());
        return;
    }
}