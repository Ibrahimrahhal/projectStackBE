// const express = require('express');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const routeHandlers = require('./routes/index');
// const securityMiddleware = require('./protectedRouteMiddleware');
// const cors = require('cors')

import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import securityMiddleware from './protectedRouteMiddleware';
import cors from 'cors';
const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: false, limit:'10mb' }));
app.use(cookieParser());
app.use(securityMiddleware);
app.use('/',routeHandlers)



export default app;
