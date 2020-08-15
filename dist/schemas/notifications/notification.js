"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
class Notification {
    constructor(ID) {
        ID = ID || util_1.GenerateRandomID();
    }
    markAsRead() {
        this.read = true;
    }
    isRead() {
        return this.read;
    }
}
exports.default = Notification;
//# sourceMappingURL=notification.js.map