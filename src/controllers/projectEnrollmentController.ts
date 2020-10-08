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
import { ProjectWithExtras } from "projectWithExtras";
export default class ProjectEnrollmentController extends ManyToMany<ProjectEnrollmentRelations, Project, User> implements Indexable{
    static instance:ProjectEnrollmentController;
    protected FirstEntityController:ProjectController;
    protected SecondEntityController:UserController;
    totalAttr  = {
        ID:"S",
        userID:"S",
        projectId:"S",
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

    public async getProjectsOfUsers(userID:string):Promise<ProjectWithExtras[]>{
        let projectEnrollmentsSearch = await Elasticsearch.search(this.indexName, {
            filters:[{
                type:'match',
                feild:'userID',
                value: userID
            }],
            sort:[{
                feild:'timestamp'
            }]
        }, undefined);

        if(projectEnrollmentsSearch.statusCode !== 200)
            return [];
        
        let response:elasticsearchResponse<ProjectEnrollmentRelations> = projectEnrollmentsSearch.body;
        let [projectIDs, isAdminArray] = response.hits.hits.map(x=>{
            return this.Factory.createItem(x._source);
        }).map(projectEnroll=>{
            return [projectEnroll.getProjectID(), projectEnroll.getIsAdmin()];
        }).reduce((rev:any, current:any)=>{
            rev[0].push(current[0]);
            rev[1].push(current[1]);
            return rev;
        }, [[],[]]) ;

        return  ((await this.FirstEntityController.getItem(projectIDs)) as  Project[]).map((project, index)=>{
            return {
                project,
                extras:{
                    isAdmin:isAdminArray[index]
                }            
            }
        });
    }

    public async getMembersOfProject(projectId:string):Promise<User[]>{
        return  (await this.SecondEntityController.getItem(await this.getMemberIDSOfProject(projectId))) as  User[];
    }

    public async addMemberToProject( enrollemnt:ProjectUserRelations ):Promise<void>{
        await super.insertItem(enrollemnt);
        await Elasticsearch.insertItem(this.indexName, enrollemnt.serializeAsJSON());
        return;
    }


    public async getMemberIDSOfProject(projectId:string):Promise<string[]>{
        let projectEnrollmentsSearch = await Elasticsearch.search(this.indexName, {
            filters:[{
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
        
        return userIDs;
    }
}

