"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
class Notification {
    constructor(ID, UserID, read = false) {
        this.read = read;
        this.UserID = UserID;
        ID = ID || util_1.GenerateRandomID();
    }
    markAsRead() {
        this.read = true;
    }
    isRead() {
        return this.read;
    }
    serializeAsJSON() {
        let obj = {};
        Object.keys(this).forEach((key) => {
            if (typeof this[key] != typeof undefined)
                obj[key] = this[key];
        });
        return obj;
    }
}
exports.default = Notification;
//# sourceMappingURL=notification.js.map