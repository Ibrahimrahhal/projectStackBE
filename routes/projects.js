const router = require('express').Router();
const Project = require('../schemas/Project');
const { encryptData } = require('../util');
router.get('/', async (req, res)=>{
    let projects = await Project.all();
    let regularObjects  = projects.map((project)=>{
        return project.toRegularObject();
    })
    res.json({data: encryptData(regularObjects)});
});



module.exports = router;