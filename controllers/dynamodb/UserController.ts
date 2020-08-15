
import Config from '../../config';
import DynamodbController from './dynamodbController';
import UsersFactory from '../../factories/usersFactory';
import User from '../../schemas/user/user';

class UserController extends DynamodbController<User>{
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

}

module.exports = UserController;
