const Notification = require('./notification');

class UserJoinRequestToRelatedProjectNotification extends Notification{
    Type = 1;
    projectID;
    senderUserID;
    receiverUserID;
    JoinRequest;
    constructor(ID, projectID, userID, JoinRequest){
        super(ID);
        this.projectID = projectID;
        this.userID = userID;
        this.JoinRequest = JoinRequest;
    }
}



module.exports = UserJoinRequestToRelatedProjectNotification;