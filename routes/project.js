const router = require('express').Router();
const Config = require('../config');
const { encryptData, decryptData, getValueFromKeyInEncryptedObject, hashFunction } = require('../util');
const { prmosieBasedDeleteItem, prmosieBasedPutItem,  prmosieBasedUpdateItem} = require('../util');
const Project = require('../schemas/Project');
const User = require('../schemas/user');

router.get('/', async (req, res)=>{
    let user = new User({email:req.user.email});
    let projects = await user.getProjects();
    let regularProjects = [];
    for(let project of projects){
        regularProjects.push(project.toRegularObject());
    }
    res.json({ data : encryptData(regularProjects)});
});


router.get('/:ID', async (req, res) => {    
    let project = await Project.getProject(req.param("ID"));
    let withMembers = req.query["members"];
    if(withMembers)
        await project.loadMembers()

    project.members = project.members  || [];
    for(let i = 0; i < project.members.length; i++)
        project.members[i] = await User.getUser(project.members[i]);

    res.json({data: encryptData(project.toRegularObject())});
});

router.post('/', async (req, res)=>{
    let { data } = req.body;
    let project = new Project({...JSON.parse(decryptData(data)), creatorEmail: req.user.email, timeCreated: Date.now()});
    let result = await prmosieBasedPutItem({
        Item: project.toDynamoDbObject(),
        TableName: Config.tables.projects
    });
    await project.addMember(req.user.email);
    res.json(result);
});

router.put('/:ID', async (req, res)=>{
    let { data } = req.body;
    let oldProject = await Project.getProject(req.param("ID"));
    if(!oldProject.isUserHasPrem(req.user.email)){
        res.sendStatus(500);
        return;
    }
    let project = new Project(JSON.parse(decryptData(data)));
    let result = await prmosieBasedUpdateItem({
        Key:{
            "ID": { "S": req.param('ID')},
        },
        TableName: Config.tables.projects,
        ...project.generatePutExprestions()
    });
    res.json(result);
});


router.get('/:ID/members', async (req, res)=>{
    let project = new Project({ID: req.params['ID']});
    await project.loadMembers();
    let hldMembers = [];
    for(memberEmail of project.members)
        hldMembers.push((await User.getUser(memberEmail)).toRegularObject());
    res.json(hldMembers);
})


router.post('/:ID/member/:email', async (req,res) => {
let project = await Project.getProject(req.param("ID"));
let userEmail = encryptData(req.param("email"));
if(!project.isUserHasPrem(req.user.email)){
    res.sendStatus(401);
    return;
}

let relID = hashFunction(projectID+userEmail);
let timeCreated = Date.now();
let result = await prmosieBasedPutItem({
    Item:{
        ID: {"S": relID},
        userID: {"S": userEmail},
        projectId: {"S": projectID},
        timeCreated: {"S": timeCreated}
    },
    TableName: Config.tables.projectUserTable
});
res.json(result);
});



router.delete('/:ID/member/:email', async (req,res)=>{
let project = Project.getProject(req.param("ID"));
if(!project.isUserHasPrem(req.user.email)){
    res.sendStatus(401);
    return;
}
let email = decryptData(req.param('email'));
let result = prmosieBasedDeleteItem({
    Key: {ID: {"S":hashFunction(project.ID + email)}},
    TableName: Config.tables.projectUserTable
})
res.json(result)
});

module.exports = router;