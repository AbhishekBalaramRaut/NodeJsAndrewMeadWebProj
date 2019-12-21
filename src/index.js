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


const myFunc = async () => {
    const token = jwt.sign({_id: 'abc123'},'my name is abhishek',{ expiresIn: '2 minute'});
    console.log(token);

    const data = jwt.verify(token,'my name is abhishek');
    console.log(data);
}

myFunc();