"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
class ProjectUserRelations {
    constructor(projectId, userID, isAdmin = false, ID, timestamp) {
        this.projectId = projectId;
        this.userID = userID;
        this.ID = ID || util_1.hashFunction(projectId + userID);
        this.timestamp = timestamp || Date.now();
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
exports.default = ProjectUserRelations;
//# sourceMappingURL=ProjectEnrollment.js.map