const {MongoClient,ObjectId} =  require('mongodb');

const connectionUrl = "mongodb://127.0.0.1:27017";
const datatbaseName = "First-project-data";

let databaseUser;
MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error,client) => {
    if(error) {
        console.log('Unable to connect to database');
        return;
    }

    const db = client.db(datatbaseName);
    databaseUser = db;
    //findOne
    db.collection('users').findOne({
        name:'Prasad'
    },(error,result) => {
        if(error) {
            console.log('Unable to fetch');
            return;
        }

        console.log(result);
    });


    //find
    db.collection('users').find({
        name:'Prasad'
    }).toArray((error,result) => {
        if(error) {
            console.log('Unable to fetch');
            return;
        }

        console.log(result);
    });

    //Count
    db.collection('users').find({
        name:'Prasad'
    }).count((error,result) => {
        if(error) {
            console.log('Unable to fetch');
            return;
        }

        console.log(result);
    });

    //Update
    db.collection('users').updateOne({
         _id:new ObjectId("5dc80ca404296803101710d4")
     },{
         $set: {
             name: 'parsha',
             age:34
         }
     }).then((result) => {
        console.log('result is '+ result);
     }).catch((error) => {
        console.log('Error is '+ error); 
     });
        
     //Update many
    db.collection('users').updateMany({
        
    },{
        $set: {
            completed: false
        }
    }).then((result) => {
       console.log('result is '+ result);
    }).catch((error) => {
       console.log('Error is '+ error); 
    });

     //Updateone and delete many -same syntax
     db.collection('users').deleteMany({
       age:54
    }).then((result) => {
       console.log('result is '+ result);
    }).catch((error) => {
       console.log('Error is '+ error); 
    });

});

module.exports = databaseUser;