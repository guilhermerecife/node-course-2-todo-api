const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Error trying to connect MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').find({
        _id: new ObjectID('5c60d0882e5d041d0b58ba5f')
    }).toArray().then((docs) => {
        console.log('todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    db.close();
});