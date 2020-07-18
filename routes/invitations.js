const router = require('express').Router();
const Project = require('../schemas/Project');
const Invitation = require('../schemas/Invitation');
const { encryptData, base64ToString, decryptData } = require('../util');

router.get('/', async (req, res)=>{
    let invitations = await Invitation.getAll(req.user.email);
    invitations = invitations.filter((inv)=>(!inv.Accepted && !inv.Rejected)).map((inv)=>inv.toRegularObject())
    res.json({data: encryptData(invitations)})
});

router.post('/:projectID/:userID', async (req,res)=>{
    let projectID = req.params['projectID'];
    let project = await Project.getProject(projectID);
    if(!project.isUserHasPrem(req.user.email)){
        res.sendStatus(401);
        return;
    }
    let userEmail = base64ToString(req.params['userID']);
    let invite = new Invitation(projectID, userEmail, req.user.email);
    await invite.put();
    res.json({});
});

router.post('accept/:invitationID', async (req, res)=>{
    let invite = await Invitation.getInvitations(req.params['invitationID']);
    if(!invite.verifyActions(req.user.email)){
        res.sendStatus(401);
        return;
    }
    invite.accept(decryptData(req.body.data));
});

router.post('reject/:invitationID', async (req, res)=>{
    let invite = await Invitation.getInvitations(req.params['invitationID']);
    if(!invite.verifyActions(req.user.email)){
        res.sendStatus(401);
        return;
    }
    invite.reject(decryptData(req.body.data));
});



module.exports = router;