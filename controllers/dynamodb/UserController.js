const DynamodbController = require('./dynamodbController');
const Config = require('../../config');


class UserController extends DynamodbController{
    static totalAttr  = {
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
    static toStringAtrr = ['skills', 'interests'];
    static primaryKey = "email";
    static dynamodbTable = Config.tables.users;
    
    constructor(firstInit){
        super(firstInit);
    }

    static getInstance = ()=>{
        if(UserController.instance)
            return UserController.instance;
        UserController.instance = new UserController(true);
        return UserController.getInstance();
    }

    getClassOfThisObject = ()=>{
        return UserController;
    }


    fromDynamodbObject = (Item)=>{
        let obj = super.fromDynamodbObject(Item);
        return 
    };
}

module.exports = UserController;
