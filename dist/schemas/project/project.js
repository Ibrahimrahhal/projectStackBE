"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
class Project {
    constructor(project) {
        for (const atrr in project)
            this[atrr] = project[atrr];
        if (!this.ID)
            this.ID = util_1.hashFunction(Date.now().toString()).substring(0, 8);
    }
    serializeAsJSON() {
        let obj = {};
        Object.keys(this).forEach((key) => {
            if (typeof this[key] != typeof undefined)
                obj[key] = this[key];
        });
        obj.members = (this.members || []).map(member => member.serializeAsJSON());
        return obj;
    }
    setMembers(users) {
        this.members = users;
    }
}
exports.default = Project;
//# sourceMappingURL=project.js.map