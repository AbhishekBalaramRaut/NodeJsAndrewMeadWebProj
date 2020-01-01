const app = require('./app');

const port  = process.env.PORT;
console.log('port',port);
app.listen(port, () => {
    console.log('Server is up and running on '+port);
});
