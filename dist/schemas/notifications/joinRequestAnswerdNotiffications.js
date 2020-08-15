"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = __importDefault(require("./notification"));
class JoinRequestAnsweredNotification extends notification_1.default {
    constructor() {
        super(...arguments);
        this.Type = 3;
    }
}
module.exports = JoinRequestAnsweredNotification;
//# sourceMappingURL=joinRequestAnswerdNotiffications.js.map