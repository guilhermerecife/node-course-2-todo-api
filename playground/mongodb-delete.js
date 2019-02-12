const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Error trying to connect MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    /*db.collection('Todos').deleteMany({text: 'Eat Pop'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete', err);
    });*/

    /*db.collection('Todos').deleteOne({text: 'Something to do'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete', err);
    });*/

    db.collection('Todos').findOneAndDelete({text: 'Something to do'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete', err);
    });

    //db.close();
});