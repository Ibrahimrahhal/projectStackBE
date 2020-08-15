"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JoinRequest {
    constructor() {
        this.timestamp = Date.now();
    }
    isOnHold() {
        return (typeof this.accepted == typeof undefined) || (typeof this.rejected == typeof undefined);
    }
    isAccepted() {
        return this.accepted === true;
    }
    isRejected() {
        return this.rejected === false;
    }
}
exports.default = JoinRequest;
//# sourceMappingURL=joinRequest.js.map