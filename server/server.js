var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

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

app.listen(3000, () => {
    console.log('App is listening!');
});

module.exports = { app };
