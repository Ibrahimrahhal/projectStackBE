import Config from '../config';
import DynamodbController from './dynamodb/dynamodbController';
import ProjectsFactory from '../factories/projectsFactory';
import Project from '../schemas/project/project';
import { Searchable } from '../implementables/searching';
import Elasticsearch from './elasticsearch/elasticSearchController';
import Indexable from "./elasticsearch/elasticsearch_indexable";
import elasticsearchResponse, { elasticsearchSingleResponse } from './elasticsearch/elasticsearch_response_body';

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

    async Search(SearchObject:any):Promise<{results:Project[], pages:number}>{
        let search:any = {
            filters:[],
            matchers:[]
        };
        
        let filters = ['projectType', 'tags'];
        let matchers = ['keyword'];
        filters.forEach((prop)=>{
            if(!(SearchObject as any)[prop] || (SearchObject as any)[prop] === '' || (SearchObject as any)[prop].length===0)
            return;
            search.filters.push({
                type:((SearchObject as any)[prop] instanceof Array)?'match':'term',
                feild:prop,
                value:(SearchObject as any)[prop]
            })
        });

        matchers.forEach((prop)=>{
            if(!(SearchObject as any)[prop]|| (SearchObject as any)[prop] === '' || (SearchObject as any)[prop].length===0)
            return;
            ['slogan', 'projectName', 'projectDesc'].forEach((x)=>{
                search.matchers.push({
                    type:'match',
                    feild:x,
                    value:(SearchObject as any)[prop]
                })
            })
            
        });

        let result:elasticsearchResponse<Project> = (await Elasticsearch.search(this.indexName, search, SearchObject.page)).body;
        return {
            results:result.hits.hits.map((res)=>this.Factory.createItem(res._source)),
            pages: Math.ceil(result.hits.total.value / Config.elasticsearch.searchPageSize)
        };
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
    

    async getItemCheap(ID:string):Promise<Project>{
        let res = (await Elasticsearch.GetItem(this.indexName, ID)).body as elasticsearchSingleResponse<Project>;
        return this.Factory.createItem(res._source);
    }



}
