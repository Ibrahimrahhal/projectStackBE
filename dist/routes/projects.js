"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = __importDefault(require("../controllers/projectController"));
const util_1 = require("../util");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let query = JSON.parse(util_1.decryptData(req.body.data));
    let results = yield projectController_1.default.getInstance().Search(query);
    results.results = results.results.map((project) => {
        return project.serializeAsJSON();
    });
    res.json({ data: util_1.encryptData(results) });
}));
exports.default = router;
//# sourceMappingURL=projects.js.map