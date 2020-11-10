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
const config_1 = __importDefault(require("../config"));
const util_1 = require("../util");
const router = express_1.default.Router();
router.put('/profile', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { body } = req;
    let type = util_1.getValueFromKeyInEncryptedObject('imgType', body);
    let base64 = body.data.split(';base64,')[1];
    let ContentType = body.data.split(';base64,')[0].split(":")[1];
    yield util_1.promiseBasedPutObject({
        Body: Buffer.from(base64, 'base64'),
        ContentEncoding: 'base64',
        ContentType,
        Key: `${util_1.hashFunction(req.user.email)}.${type}`,
        Bucket: config_1.default.buckets.userProfile
    });
    res.json({
        data: util_1.encryptData(`${config_1.default.getBucketBaseUrl(config_1.default.buckets.userProfile)}${util_1.hashFunction(req.user.email)}.${type}`)
    });
}));
router.put('/resume', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { body } = req;
    let type = util_1.getValueFromKeyInEncryptedObject('resumeType', body);
    yield util_1.promiseBasedPutObject({
        Body: Buffer.from(body.data, 'base64'),
        Key: `${util_1.hashFunction(req.user.email)}.${type}`,
        Bucket: config_1.default.buckets.userResumes
    });
    res.json({
        data: util_1.encryptData(`${util_1.hashFunction(req.user.email)}.${type}`)
    });
}));
exports.default = router;
//# sourceMappingURL=storage.js.map