var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log('Todo saved', doc);
        res.json(doc);
    }, (e) => {
        console.log('Unable to save');
        res.status(400).json(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        console.log('Fetching todos');
        res.send({
            todos
        })
    }, (err) => {
        console.log('Unable to fetch todos', err);
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }
    Todo.findById(req.params.id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.send(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`App is listening on ${port}!`);
});

module.exports = { app };
