import Config from '../config';
import DynamodbController from './dynamodb/dynamodbController';
import ProjectsFactory from '../factories/projectsFactory';
import Project from '../schemas/project/project';
import { Searchable } from '../implementables/searching';
import Elasticsearch from './elasticsearch/elasticSearchController';
import Indexable from "./elasticsearch/elasticsearch_indexable";

export default class ProjectController extends DynamodbController<Project> implements Searchable<Project>, Indexable{
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
    indexName = Config.elasticsearch.indices.projects;
    private constructor(){
        super();
    }

    static getInstance():ProjectController{
        if(ProjectController.instance)
            return ProjectController.instance;
        ProjectController.instance = new ProjectController();
        return ProjectController.getInstance();
    }

    Search(SearchObject:any):Promise<Project>{
        return new Promise(X=>X);
    }

    getItem(projectID:string | Array<string>):Promise<Project | Project[]>{
        return super.getItem(projectID);
    }

    async patchItem(Item:Project):Promise<void>{
        await super.patchItem(Item);
        await Elasticsearch.PatchItem(this.indexName, Item.serializeAsJSON());
        return;
    }

    async insertItem(Item:Project):Promise<void>{
        await super.insertItem(Item);
        await Elasticsearch.insertItem(this.indexName, Item.serializeAsJSON());
        return;
    }
    





}
