const { GenerateRandomID } = require('../../util');

class Notification{
    ID;
    read;
    
    constructor(ID){
        ID = ID || GenerateRandomID();
    }
    markAsRead = ()=>{
        this.read = true;
    }

    isRead = ()=>{
        return this.read;
    }
}

module.exports = Notification;