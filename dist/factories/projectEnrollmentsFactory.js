"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectEnrollment_1 = __importDefault(require("../schemas/relations/ProjectEnrollment"));
const factory_1 = __importDefault(require("./factory"));
class ProjectEnrollmentFactory extends factory_1.default {
    createItem(json) {
        return this.FromJSON(json);
    }
    createItemParams(userID, projectId, isAdmin = false) {
        return this.FromJSON({ userID, projectId, isAdmin });
    }
    FromJSON({ ID, userID, projectId, isAdmin, timestamp }) {
        return new ProjectEnrollment_1.default(projectId, userID, isAdmin, ID, timestamp);
    }
}
exports.default = ProjectEnrollmentFactory;
//# sourceMappingURL=projectEnrollmentsFactory.js.map