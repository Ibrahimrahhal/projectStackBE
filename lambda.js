"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_serverless_express_1 = __importDefault(require("aws-serverless-express"));
const app_1 = __importDefault(require("./app"));
const binaryMimeTypes = [
    'application/octet-stream',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml'
];
const server = aws_serverless_express_1.default.createServer(app_1.default, null, binaryMimeTypes);
exports.default = (event, context) => aws_serverless_express_1.default.proxy(server, event, context);
exports.handler = (event, context) => aws_serverless_express_1.default.proxy(server, event, context);
//# sourceMappingURL=lambda.js.map