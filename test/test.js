const mongoose = require('mongoose');
const User = require('../models/User');

const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');
const server = require('../app.js');


const request = require('supertest')(server);
const { use } = require('chai');
const { timeout } = require('nodemon/lib/config');
const { post } = require('superagent');
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
    
    //users 
    describe('should test users signup', ()=>{
        it('should sign new user', done => {
            const user = {
              full_name: 'Julien ishimwe',
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
        }).timeout(30000);

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
        }).timeout(30000);

        
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
        }).timeout(30000);

    });

    
    //Users information login
    describe('User Login, Get users, Update Profile and delete', ()=>{
      //get all user as Admin
        it('should login and get all signed up user as Admin', done => {
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

                let token = res.body.token;
            
            serChai
                .get('/api/v1/users')
                .set({'Cookie': `jwt=${token}`})
                .end((err, res) =>{
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message', 'All Users accounts')
                  done();
                });
              });
          }).timeout(30000);

          //UPDATE USER

          it('should sign new user, Get one user & update profile', done => {
            const new_user = {full_name: "great eric", email: "greateric1@gmail.com", password: "greatEric123"};
            const update_user = {full_name: "great eric kanya", email: "greatkan2@gmail.com", password: "greatkany1234"};
            serChai
              .post('/api/v1/users/signUp')
              .send(new_user)
              .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(undefined);

                const newUser = res.body.data.user

                expect(newUser.full_name).to.be.equal(new_user.full_name)
                expect(newUser.email).to.be.equal(new_user.email)

                const userId = newUser._id;
            serChai
                .post('/api/v1/users/login')
                .send({email: 'julish123@gmail.com', password: 'julish123'})
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('token');

                  let token = res.body.token;

                  serChai
                    .patch(`/api/v1/users/${userId}`)
                    .set({'Cookie': `jwt=${token}`})
                    .send(update_user)
                    .end((err, res) =>{
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.a('object');
                    done();
                    })
                });
              })
          }).timeout(30000);   
          
          //DELETE USER

          it('should sign new user and delete', done => {
            const new_user = {full_name: "name emmy", email: "nameemmy@gmail.com", password: "nameemmy123"};
            serChai
              .post('/api/v1/users/signUp')
              .send(new_user)
              .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(undefined);

                const newUser = res.body.data.user

                expect(newUser.full_name).to.be.equal(new_user.full_name)
                expect(newUser.email).to.be.equal(new_user.email)

                const userId = newUser._id;
            serChai
                .post('/api/v1/users/login')
                .send({email: 'julish123@gmail.com', password: 'julish123'})
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('token');

                  let token = res.body.token;

                  serChai
                    .delete(`/api/v1/users/${userId}`)
                    .set({'Cookie': `jwt=${token}`})
                    .end((err, res) =>{
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.a('object');
                    done();
                    })
                });
              })
          }).timeout(30000); 
          
    });

    
  
 //CREATE GET UPDATE DELETE AN ARTICLE
 
 
    describe('Article & Comments CREATE GET UPDATE DELETE', () =>{
      
      it('should CREATE article, GET one, comment, Get comment and delete that comment', done => {
          const article = {
            title: "ARTICLE Mocha TEST TEST",
            content: "the context of the first article"
          };
          const user = {
            email: 'julish123@gmail.com',
            password: 'julish123'
          };
          const add_comment = {
            text: "This is cool topic ever!"
          };
            serChai
            .post('/api/v1/users/login')
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
              res.body.should.have.property('message', 'logged in successfully!');
              
              let token = res.body.token;

            serChai
              .post('/api/v1/articles')
              .set({'Cookie': `jwt=${token}`})
              .send(article)
              .end((err, res) => {
                  expect(res.status).to.equal(201);
                  expect(res.body).to.be.a('object');
                  res.body.should.have.property('message', 'New article created successfully!');

                  const newArt = res.body.data.post
                  expect(newArt.title).to.be.equal(article.title)
                  expect(newArt.content).to.be.equal(article.content)

                  const postId = newArt._id;
                  serChai
                    .get(`/api/v1/articles/${postId}`)
                    .end((err, res) =>{
                      expect(res.status).to.equal(200);
                      expect(res.body).to.be.a('object');
                    });
                    
                      //COMMENTS on article

                    serChai
                        .put(`/api/v1/articles/${postId}/comment`)
                        .set({'Cookie': `jwt=${token}`})
                        .send(add_comment)
                        .end((err, res) =>{
                              expect(res.status).to.equal(200);
                              expect(res.body).to.be.a('object');

                              const new_comment = res.body.data.saveComment
                              expect(new_comment.text).to.be.equal(add_comment.text)

                              const commentId = new_comment._id;
                                serChai
                                    .get(`/api/v1/articles/comments/all/${commentId}`)
                                    .set({'Cookie': `jwt=${token}`})
                                    .end((err, res) => {
                                        expect(res.status).to.equal(200);
                                        expect(res.body).to.be.a('object');
                                        res.body.should.have.property('message', 'Comment');
                                    })
                                serChai
                                      .delete(`/api/v1/articles/comments/all/${commentId}`)
                                      .set({'Cookie': `jwt=${token}`})
                                      .end((err, res) => {
                                          expect(res.status).to.equal(200);
                                          expect(res.body).to.be.a('object');
                                          res.body.should.have.property('message', 'comment deleted!');  
                                      })
                          });
                      
              })
              done();
            })
        }).timeout(15000); 
        
        //GET all comments 

        it('should GET all commet as an admin', done =>{
          serChai 
              .post('/api/v1/users/login')
              .send({email: 'julish123@gmail.com', password: 'julish123'})
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                
                let token = res.body.token;
                serChai
                    .get('/api/v1/articles/comments/all')
                    .set({'Cookie': `jwt=${token}`})
                    .end((err, res)=>{
                      expect(res.status).to.be.equal(200);
                      expect(res.body).to.be.a('object');
                      res.body.should.have.property('message', 'All comments');
                      done();
                    });
              });
        }).timeout(15000);

     
        it('should get all the articles in db', done =>{
          serChai
              .get('/api/v1/articles')
              .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.have.property('message', 'All created articles');
                done();
              });
        }).timeout(30000);

        it('should add article, update and delete', done => {
          const new_one = {
            title: 'This is the new article to be updated and after deleted',
            content: 'this is the content of the article'
          };
          const update_one = {
            title: 'Now this article is updated and it gonna be deleted',
            content: 'this is the content of the article'
          };
          serChai
            .post('/api/v1/users/login')
            .send({email: 'julish123@gmail.com', password: 'julish123'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                
                let token = res.body.token;
          serChai
              .post('/api/v1/articles')
              .set({'Cookie': `jwt=${token}`})
              .send(new_one)
              .end((err, res) => {
                  expect(res.status).to.equal(201);
                  expect(res.body).to.be.a('object');

                  const newArt = res.body.data.post
                  expect(newArt.title).to.be.equal(new_one.title)
                  expect(newArt.content).to.be.equal(new_one.content)

                  const postId = newArt._id;
          serChai
              .patch(`/api/v1/articles/${postId}`)
              .set({'Cookie': `jwt=${token}`})
              .send(update_one)
              .end((err, res) =>{
                  expect(res.status).to.equal(200);
                  expect(res.body).to.be.a('object');
              })

          serChai
              .delete(`/api/v1/articles/${postId}`)
              .set({'Cookie': `jwt=${token}`})
              .end((err, res) =>{
                  expect(res.status).to.equal(200);
                  expect(res.body).to.be.a('object');
                done();
              })
          });
        }).timeout(30000);
      });
    
  
                                  
		});


    //MESSAGE TESTING

  

    describe('Test messages routes', ()=>{

      it('should GET all messages as an admin', done =>{
        serChai
          .post('/api/v1/users/login')
          .send({email: 'julish123@gmail.com', password: 'julish123'})
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
              
              let token = res.body.token;
              //get all messages as admin
        serChai
            .get('/api/v1/messages')
            .set({'Cookie': `jwt=${token}`})
            .end((err, res) => {
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.a('object');
              res.body.should.have.property('message', 'All Messages');
                  done();
              });
          })
      }).timeout(20000);

      // POST, GET and Delete message
      
      it('should submit message GET one and DELETE', done => {
        const submit_msg = {
          name: "rutirirwa paul",
          email: "rwegoabata@gmail.com",
          message: "Hello, I like your project"
        }

        serChai
          .post('/api/v1/users/login')
          .send({email: 'julish123@gmail.com', password: 'julish123'})
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
              
              let token = res.body.token;
              //new message to be deleted
          serChai
            .post('/api/v1/messages')
            .send(submit_msg)
            .end((err, res) => {
              expect(res.status).to.be.equal(201);
              expect(res.body).to.be.a('object');
              res.body.should.have.property('message', 'Message submitted successfully!');

              const new_message = res.body.data.message
              expect(new_message.email).to.be.equal(submit_msg.email)
              expect(new_message.message).to.be.equal(submit_msg.message)

              const messageId = new_message._id;
              //get specific message
          serChai
              .get(`/api/v1/messages/${messageId}`)
              .set({'Cookie': `jwt=${token}`})
              .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                res.body.should.have.property('message', 'Message'); 
              });
              //delete message
          serChai
                .delete(`/api/v1/messages/${messageId}`)
                .set({'Cookie': `jwt=${token}`})
                .end((err, res) =>{
                  expect(res.status).to.equal(200);
                  expect(res.body).to.be.a('object');
                  res.body.should.have.property('message', 'Message deleted!');
                  done();
                }); 
            });
          });
      }).timeout(20000);
  });


 
 
});
