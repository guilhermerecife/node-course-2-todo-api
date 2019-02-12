const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Error trying to connect MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5c61fe53a203b315e916b994")
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5c60d14bc015221d48ef3076")
    }, {
        $set: {
            name: "Guilherme Carol de Melo"
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    //db.close();
});