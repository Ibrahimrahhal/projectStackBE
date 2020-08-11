const { LexModelBuildingService } = require('aws-sdk');
const Notification = require('./notification');

class JoinRequestAnsweredNotification extends Notification{
    Type = 3;
    RequestID;
    UserID;
}

module.exports = JoinRequestAnsweredNotification;