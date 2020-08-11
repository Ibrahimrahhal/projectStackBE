const DynamodbController = require('./dynamodbController');
const Config = require('../../config');


class ProjectController extends DynamodbController{
    static totalAttr  = {
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
    static toStringAtrr = ['tags']
    static primaryKey = "ID";
    static dynamodbTable = Config.tables.projects;
    
    constructor(firstInit){
        super(firstInit);
    }

    static getInstance = ()=>{
        if(ProjectController.instance)
            return ProjectController.instance;
            ProjectController.instance = new ProjectController(true);
        return ProjectController.getInstance();
    }

    getClassOfThisObject = ()=>{
        return ProjectController;
    }


    fromDynamodbObject = (Item)=>{
        let obj = super.fromDynamodbObject(Item);
        return 
    };


    
}

module.exports = ProjectController;
