const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const { getMaxListeners } = require('../app.js');

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)
const serChai = chai.request(server).keepOpen();

describe('My brand api testing', () => {

    describe('Welcome to api', ()=>{
        it('should return welcome text from server', done =>{
            chai.request(server)
                .get('/').end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                done();
            });
        });
    });
    /*
    //users 
    describe('should test users signup', ()=>{
        it('should sign new user', done => {
            const user = {
              full_name: 'Julien ishi',
              email: 'julish1@gmail.com',
              password: 'julish123'
            };
               serChai
                .post('/api/v1/users/signUp')
                .send(user)
                .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(undefined);
                done();
            });       
        }).timeout(20000);

        it('should throw a message Email already exist', done => {
            const user = {
                full_name: 'Julio ish',
                email: 'julish123@gmail.com',
                password: 'julish123'
            };
            serChai
                .post('/api/v1/users/signUp')
                .send(user)
                .end((err, res) => {
                res.should.have.status(409);
                res.body.should.have.property('message', 'Email already Exist');
                done();
                });
        }).timeout(20000);

        
        it('Should throw error when there\'s validation error', done => {
            const user = {
                full_name: 'Julius ish',
                email: 'julishmail.com',
                password: 'julish1233'
            };
            serChai
                .post('/api/users/v1/signUp')
                .send(user)
                .end((err, res) => {
                res.should.have.status(404);
                res.should.have.be.a('object');

                done();
                });
        }).timeout(20000);

        // it('Should GET all the users', done => {
            
        // }).timeout(20000);
    });

    //Users login
    describe('Users login', ()=>{
        it('should loggin in if user exist', done => {
            const userLogin = {
                email: 'julish123@gmail.com',
                password: 'julish123'
            };
            serChai
              .post('/api/v1/users/login')
              .send(userLogin)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('message', 'logged in successfully!');
                done();
              });
          }).timeout(20000);
    });
    */
    //Post articles 

    describe('Create, get, get one, update, delete article', () =>{
        it('should create new article', done => {
            serChai
                .post('/api/v1/users/login')
                .send({
                    email: 'julish123@gmail.com',
                    password: 'julish123'
                })
                .end((err, res)=>{
                    console.log('this runs the login part');
                    res.body.should.have.property('token');
                    let token = res.body.token;
                
                    const newArticle = {
                        title: "this is new article",
                        content: "the context of the first article"
                    };
                        serChai
                        .post('/api/v1/articles')
                        .set('Cookie', 'jwt', +token)
                        .send(newArticle)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message', 'article created successfully!');
                            done();
                        })
                });                   
		}).timeout(20000);
    });

/*
    it('should register + login a user, create blog and verify 1 in DB', done => {
        // 1) Register new user
        const user = {
          full_name: 'Peter Petersen',
          email: 'mail2@gmail.com',
          password: '12345678'
        };
       api
          .post('/api/v1/users/signUp')
          .send(user)
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(201);
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.equal(undefined);
    
            // 2) Login the user
           api
              .post('/api/v1/users/login')
              .send({
                email: 'mail2@gmail.com',
                password: '12345678'
              })
              .end((err, res) => {
               
                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body.error).to.be.equal(undefined);
                const { token } = res.body;
    
                // 3) Create new blog
                const blog = {
                  title: 'Test blog',
                  title: 'Test blog Description',
                };
               api
               .post('/api/v1/articles')
               .set({'Cookie': `jwt=${token}`})
                  .send(blog)
                  .end((err, res) => {
                    // Asserts
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.a('object');
    
                    const savedBlog = res.body.data.blog;
                    expect(savedBlog.title).to.be.equal(blog.title);
                    expect(savedBlog.body).to.be.equal(blog.body);
    
                    // 4) Verify one blog in test DB
                    const blogId = savedBlog._id;
                   api
                      .get(`/api/v1/articles/${blogId}`)
                      .end((err, res) => {
                        // Asserts
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a('object');
                        done();
                      });
                    });
                  });
                });
      }).timeout(30000);
*/
 
    
});
