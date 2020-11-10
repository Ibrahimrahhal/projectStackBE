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
const UserController_1 = __importDefault(require("../controllers/UserController"));
const util_1 = require("../util");
const router = express_1.default.Router();
router.patch('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let user = Object.assign({}, JSON.parse(util_1.decryptData(req.body.data)), { email: req.user.email });
    try {
        yield UserController_1.default.getInstance().patch(user);
        res.json({});
    }
    catch (e) {
        console.log(e.toString());
        res.sendStatus(500);
    }
}));
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let user = yield UserController_1.default.getInstance().getItem(req.user.email);
        res.json({ data: util_1.encryptData(user.serializeAsJSON()) });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
router.get('/:ID', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let email = util_1.base64ToString(req.params['ID']);
    try {
        let user = yield UserController_1.default.getInstance().getItem(email);
        res.json({ data: util_1.encryptData(user.serializeAsJSON()) });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map