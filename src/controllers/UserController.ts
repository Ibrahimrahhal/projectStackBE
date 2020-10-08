
import Config from '../config';
import DynamodbController from './dynamodb/dynamodbController';
import UsersFactory from '../factories/usersFactory';
import User from '../schemas/user/user';
import { Searchable } from '../implementables/searching';
import ElasticsearchController from '../controllers/elasticsearch/elasticSearchController';
import Indexable from './elasticsearch/elasticsearch_indexable';
import elasticsearchResponse, { elasticsearchSingleResponse } from './elasticsearch/elasticsearch_response_body';
import membersQuery from 'membersQuery';

export default class UserController extends DynamodbController<User> implements  Indexable{
    static instance:UserController;

    totalAttr  = {
        email:'S',
        firstName:'S',
        lastName:'S',
        userType:'N',
        profileImage:'S',
        skills:'S',
        resume:'S',
        interests:'S',
        university:'N',
        department:'N',
        yearOfGrad:'N',
        headline:'S',
        projects:'S',
        summery:'S'
    };
    toStringAtrr = ['skills', 'interests'];
    primaryKey = "email";
    dynamodbTable = Config.tables.users;
    indexName = Config.elasticsearch.indices.users;
    Factory = new UsersFactory();

    private constructor(){
        super();
    }

    static getInstance():UserController{

        if(UserController.instance)
            return UserController.instance;
        UserController.instance = new UserController();
        return UserController.getInstance();
    }


    async Search(SearchObject:membersQuery, userEmail:string):Promise<{results:User[], pages:number}>{
        let search:any = {
            filters:[],
            matchers:[],
            exists:['userType'],
            // not:[{
            //     feild:'email',
            //     value:userEmail
            // }]
        };
        let filters = ['department', 'interests', 'skills', 'university'];
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
            ['firstName', 'lastName', 'headline', 'summery'].forEach((x)=>{
                search.matchers.push({
                    type:'match',
                    feild:x,
                    value:(SearchObject as any)[prop]
                })
            })
            
        });

        let result:elasticsearchResponse<User> = (await ElasticsearchController.search(this.indexName, search, SearchObject.page)).body;
        return{
            results:result.hits.hits.map((res)=>this.Factory.createItem(res._source)),
            pages: Math.ceil(result.hits.total.value / Config.elasticsearch.searchPageSize)
        }
        return ;
    }

    async patch(object:any):Promise<void>{
        let user = this.Factory.createItem(object);
        await this.patchItem(object);
        await ElasticsearchController.PatchItem(this.indexName, user.serializeAsJSON(), user.serializeAsJSON().email);
    }

    async getItem(primaryKey:string | Array<string>):Promise<User | User[]>{
        return await super.getItem(primaryKey);
    }

    async getItemCheap(ID:string):Promise<User>{
        let res = (await ElasticsearchController.GetItem(this.indexName, ID)).body as elasticsearchSingleResponse<User>;
        return this.Factory.createItem(res._source);
    }

}

module.exports = UserController;
