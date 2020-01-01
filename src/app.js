const express = require('express');
require('./db/mongoose');
const jwt = require('jsonwebtoken');

const port  = process.env.PORT;
const app = express();
app.use(express.json());

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
app.use(userRouter);
app.use(taskRouter);

module.exports = app;