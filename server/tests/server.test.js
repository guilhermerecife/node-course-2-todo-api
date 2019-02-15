const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: "Test todo 1"
}, {
    _id: new ObjectID(),
    text: "Test todo 2"
}];

beforeEach((done) => {//before each test case
    Todo.remove({}).then(() => {//clear todo collection
        return Todo.insertMany(todos);//insert defaults todos
    }).then(() => done());
});

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)//Make a get request on app
            .delete(`/todos/${hexId}`)//in that url with _id for the first todo
            .expect(200)//expect response status code to be 200
            .expect((res) => {//and text from response to be equals of the first todo
                expect(res.body.todo._id).toBe(hexId);
            }).end((err, res) => {
                if(err) {//if some errors ocurrs in previous expext, call done as wrong test
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch(e => done(e));
            });
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)//Make a get request on app
            .get(`/todos/${new ObjectID().toHexString()}`)//in that url with random _id
            .expect(404)//expect response status code to be 404
            .end(done);
    });

    it('Should return 404 if object id is invalid', (done) => {
        request(app)//Make a get request on app
            .get(`/todos/1234`)//in that url with random _id
            .expect(404)//expect response status code to be 404
            .end(done); 
    });
});

describe('GET /todos/:id', () => {
    it('Should get todo doc', (done) => {
        request(app)//Make a get request on app
            .get(`/todos/${todos[0]._id.toHexString()}`)//in that url with _id for the first todo
            .expect(200)//expect response status code to be 200
            .expect((res) => {//and text from response to be equals of the first todo
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)//Make a get request on app
            .get(`/todos/${new ObjectID().toHexString()}`)//in that url with random _id
            .expect(404)//expect response status code to be 404
            .end(done);
    });

    it('Should return 404 for non-objects id', (done) => {
        request(app)//Make a get request on app
            .get(`/todos/1234`)//in that url with random _id
            .expect(404)//expect response status code to be 404
            .end(done);
    });
})

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)//Make a get request on app
            .get('/todos')//in that url
            .expect(200)//expect response status code to be 200
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);//expect two todos in todos array
            })
            .end(done);
    });
});

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = "Play GTA";

        request(app)//Make a post request on app
            .post('/todos')//in that url
            .send({text})//sending it as parameter
            .expect(200)//expect response status code to be 200
            .expect((res) => {
                expect(res.body.text).toBe(text);//and the text attribute in body to be text.
            })
            .end((err, res) => {
                if(err) {//if some errors ocurrs in previous expext, call done as wrong test
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);//expect it saved the todo in the database
                    expect(todos[0].text).toBe(text);//and the one saved has text attr equals text
                    done();
                }).catch((err) => done(err));//if not match the two expexts, call done as wrong test
            });
    });

    it('Should not create todo with invalid data', (done) => {
        request(app)//Make a post request on app
            .post('/todos')//in that url
            .send({})//sending empty object as parameter
            .expect(400)//expect response status code to be 400
            .end((err, res) => {
                if(err) {//if some errors ocurrs in previous expext, call done as wrong test
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);//expect it didnt save the todo in the database
                    done();
                }, (err) => done(err));
            });
    });
});
