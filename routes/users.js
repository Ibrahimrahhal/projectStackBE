const router = require('express').Router();
const User = require('../schemas/user');
const { encryptData } = require('../util');

router.get('/', async (req,res)=>{
    let users = await User.all();
    let regularObjects  = users.filter((user)=>{
        return User.isUserVerfied(user);
    }).map((user)=>{
        user = User.shapeUserForPublicAccess(user);
        return user.toRegularObject();
    });
    res.json({data: encryptData(regularObjects)});
});



module.exports = router;