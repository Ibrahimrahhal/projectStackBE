"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schemas/user/user"));
const factory_1 = __importDefault(require("./factory"));
class UsersFactory extends factory_1.default {
    createItem(userObject) {
        return new user_1.default(userObject);
    }
}
exports.default = UsersFactory;
//# sourceMappingURL=usersFactory.js.map