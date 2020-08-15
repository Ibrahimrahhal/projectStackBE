"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(user) {
        for (const atrr in user)
            this[atrr] = user[atrr];
    }
    serializeAsJSON() {
        let obj = {};
        Object.keys(this).forEach((key) => {
            if (typeof this[key] != typeof undefined)
                obj[key] = this[key];
        });
        if (typeof obj.userType != typeof undefined)
            obj.userCompletedSignup = true;
        return obj;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map