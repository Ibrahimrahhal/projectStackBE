const JoinRequest = require('./joinRequest');

class UserJoinRequest extends JoinRequest {
    actionDoneBy;
    type = 2;
    markAsAccepted = (UserIDThatAccepted, message)=>{
        this.accpted = true;
        this.actionDoneBy = UserIDThatAccepted
        this.acceptionMessage = message;
    }

    markAsRejected = (UserIDThatRejected, message)=>{
        this.rejected = true;
        this.actionDoneBy = UserIDThatRejected
        this.rejectedMessage = message 
    }
}


module.exports = UserJoinRequest; 