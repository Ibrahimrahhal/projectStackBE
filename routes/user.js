const router = require('express').Router();
const User = require('../schemas/user');
const { encryptData, decryptData, base64ToString } = require('../util');
const { validateUpdateReqBelongToSameUser } = require('../protectedRouteMiddleware');

router.patch('/' , async (req,res)=>{
    let userToPut = new User({...JSON.parse(decryptData(req.body.data)), email:req.user.email});
    res.json(await userToPut.patch());
});

router.get('/', async (req,res)=>{
    let user = await User.getUser(req.user.email);
    res.json({data: encryptData(user.toRegularObject())});
});

router.get('/:ID', async (req,res)=>{
    let email = base64ToString(req.params['ID']);
    let user = await User.getUser(email);
    user = User.shapeUserForPublicAccess(user);
    res.json({data: encryptData(user.toRegularObject())});
});


module.exports = router;