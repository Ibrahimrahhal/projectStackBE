import Notification from './notification';
class JoinRequestAnsweredNotification extends Notification{
    Type:Number = 3;
    RequestID:string;
    UserID:string;
}

module.exports = JoinRequestAnsweredNotification;