var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

/*var newTask = new Todo({text: "Play GTA"});

newTask.save().then((doc) => {
    console.log('Saved todo', doc);
}, (err) => {
    console.log('Unable to save Todo', err);
});*/

/*var otherTask = new Todo({
    text: "Study",
    completed: true,
    completedAt: 123
});

otherTask.save().then((doc) => {
    console.log(doc);
}, (err) => {
    console.log(err);
});*/

var user = new User({
    email: 'guilherme_liver@hotmail.com'
}).save().then((doc) => {
    console.log(doc);
}, (err) => {
    console.log(err);
});
