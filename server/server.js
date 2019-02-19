
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }else {
        body.completedAt = null;
        body.completed = false;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

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

app.delete('/todos/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
  
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`App is listening on ${port}!`);
});

module.exports = { app };
