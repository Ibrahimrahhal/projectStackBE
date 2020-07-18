const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const routeHandlers = require('./routes/index');
const securityMiddleware = require('./protectedRouteMiddleware');
const cors = require('cors')
app.use(cors())
app.use(logger('dev'));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: false, limit:'10mb' }));
app.use(cookieParser());
app.use(securityMiddleware);
app.use('/',routeHandlers)



module.exports = app;
