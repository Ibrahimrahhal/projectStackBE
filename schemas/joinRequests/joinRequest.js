class JoinRequest{
    ID;
    userID;
    projectID;
    message;
    accepted;
    rejected;
    rejectionMessage;
    acceptionMessage;
    timestamp;

    constructor(){
        this.timestamp = Date.now();
    }
    
    isOnHold = ()=>{
        return (typeof this.accepted == typeof undefined) || (typeof this.rejected == typeof undefined);
    }

    isAccepted = ()=>{
        return this.accepted === true;
    }

    isRejected = ()=>{
        return this.rejected === false;
    }

    markAsAccepted = (message)=>{
        this.accepted = true;
        this.acceptionMessage = message;
    }

    markAsRejected = (message)=>{
        this.rejected = true;
        this.rejectionMessage = message;
    }
}

module.exports = JoinRequest;