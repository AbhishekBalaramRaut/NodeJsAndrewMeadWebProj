
const {MongoClient,ObjectId} =  require('mongodb');
const express = require('express');
const app = express();

const port  = process.env.PORT || 3000;

app.use(express.json());

MongoClient.connect("mongodb://127.0.0.1:27017", {useNewUrlParser: true, useUnifiedTopology:true}, (error,client) => {
    if(error) {
        console.log('Unable to connect to database');
        return;
    }

    basicMongo = client.db("First-project-data-123");
    console.log('basic Mongo Loaded');

        
});


app.post('/users123', (req,res) => {
    debugger;
    basicMongo.collection('users1').find({
        name:'Prasad'
    }).count((error,result) => {
        if(error) {
            console.log('Unable to fetch');
            return;
        }

        console.log(result);
        res.send({result1: result});
    });
});

console.log('port',port);
app.listen(port, () => {
    console.log('Server is up and running!');
});
