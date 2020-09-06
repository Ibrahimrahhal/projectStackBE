
import Config from '../config';
import DynamodbController from './dynamodb/dynamodbController';
import UsersFactory from '../factories/usersFactory';
import User from '../schemas/user/user';
import { Searchable } from '../implementables/searching';
import ElasticsearchController from '../controllers/elasticsearch/elasticSearchController';
import Indexable from './elasticsearch/elasticsearch_indexable';

export default class UserController extends DynamodbController<User> implements Searchable<User>, Indexable{
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


    Search(SearchObject:any):Promise<User>{

        return new Promise(X=>X);
    }

    async patch(object:any):Promise<void>{
        let user = this.Factory.createItem(object);
        await this.patchItem(object);
        await ElasticsearchController.PatchItem(this.indexName, user.serializeAsJSON(), user.serializeAsJSON().email);
    }

    async getItem(primaryKey:string | Array<string>):Promise<User | User[]>{
        return await super.getItem(primaryKey);
    }

}

module.exports = UserController;
