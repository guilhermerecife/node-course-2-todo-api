const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    text: "Test todo 1"
}, {
    text: "Test todo 2"
}];

beforeEach((done) => {//before each test case
    Todo.remove({}).then(() => {//clear todo collection
        return Todo.insertMany(todos);//insert defaults todos
    }).then(() => done());
});

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
