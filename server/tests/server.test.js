const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var updated = {
            text: "Updated",
            completed: true
        };

        request(app)//Make a patch request on app
            .patch(`/todos/${hexId}`)//in that url with _id for the first todo
            .send(updated)//sending it as parameter
            .expect(200)//expect response status code to be 200
            .expect((res) => {//and text from response to be equals of the first todo
                expect(res.body.todo.text).toBe(updated.text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            }).end(done);
    });

    it('Should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var updated = {
            text: "Updated",
            completed: false
        };

        request(app)//Make a patch request on app
            .patch(`/todos/${hexId}`)//in that url with _id for the first todo
            .send(updated)//sending it as parameter
            .expect(200)//expect response status code to be 200
            .expect((res) => {//and text from response to be equals of the first todo
                expect(res.body.todo.text).toBe(updated.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            }).end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)//Make a delete request on app
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
        request(app)//Make a delete request on app
            .get(`/todos/${new ObjectID().toHexString()}`)//in that url with random _id
            .expect(404)//expect response status code to be 404
            .end(done);
    });

    it('Should return 404 if object id is invalid', (done) => {
        request(app)//Make a delete request on app
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

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)//Make a post request on app
            .get('/users/me')//in that url
            .set('x-auth', users[0].tokens[0].token)//sending x-auth token
            .expect(200)//expect response status code to be 200
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app)//Make a post request on app
            .get('/users/me')//in that url
            .expect(401)//expect response status code to be 401
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        var email = 'guilherme_liver@hotmail.com'
            , password = '123456';
        request(app)//Make a post request on app
            .post('/users')//in that url
            .send({ email, password })
            .expect(200)//Expect response status code to be 200
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch(err => done(err));;
            });
    });

    it('Should return validation errors if request invalid', (done) => {
        var email = 'guilherme'
            , password = '123';
        request(app)//Make a post request on app
            .post('/users')//in that url
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it('Should not create user if email in use', (done) => {
        var email = users[0].email
            , password = '123456';
        request(app)//Make a post request on app
            .post('/users')//in that url
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
        var email = users[1].email
            , password = users[1].password;
        request(app)//Make a post request on app
            .post('/users/login')//in that url
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should reject invalid login', (done) => {
        var email = users[1].email
        , password = 'wrongPassword';
        request(app)//Make a post request on app
            .post('/users/login')//in that url
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(err => done(err));
            });
    });
});
