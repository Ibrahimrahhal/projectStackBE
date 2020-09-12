"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = __importDefault(require("../schemas/project/project"));
const factory_1 = __importDefault(require("./factory"));
class ProjectsFactory extends factory_1.default {
    createItem(projectObject) {
        return new project_1.default(projectObject);
    }
}
exports.default = ProjectsFactory;
//# sourceMappingURL=projectsFactory.js.map