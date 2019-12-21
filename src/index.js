const express = require('express');

const app = express();
require('./db/mongoose');

const jwt = require('jsonwebtoken');

const port  = process.env.PORT;

app.use(express.json());

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
app.use(userRouter);
app.use(taskRouter);

console.log('port',port);
app.listen(port, () => {
    console.log('Server is up and running on '+port);
});
