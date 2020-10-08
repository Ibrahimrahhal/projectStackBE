"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const index_1 = __importDefault(require("./routes/index"));
// const securityMiddleware = require('./protectedRouteMiddleware');
// const cors = require('cors')
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const protectedRouteMiddleware_1 = __importDefault(require("./protectedRouteMiddleware"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookie_parser_1.default());
app.use(protectedRouteMiddleware_1.default);
app.use('/', index_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map