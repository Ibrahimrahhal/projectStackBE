const Notification = require('./notification');

class ProjectJoinRequestNotification extends Notification{
    Type = 2;
    projectID;
    userID;
    JoinRequest;
    constructor(ID, projectID, userID, JoinRequest){
        super(ID);
        this.projectID = projectID;
        this.userID = userID;
        this.JoinRequest = JoinRequest;
    }
}



module.exports = ProjectJoinRequestNotification;