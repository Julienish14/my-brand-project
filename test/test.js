const superT = require('supertest');
const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const { request } = require('chai');

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)



//Test message router

mocha.describe("GET/ Messages", () => {
    it ("it should GET all messages", (done) => {
        chai.request(server)
            .get("/api/v1/messages");
             done();
            });
});

mocha.describe("GET/ Messages by id", () => {
    it ("it should GET a specific messages", (done) => {
        chai.request(server)
            .get("/api/v1/messages/:messageId");
             done();
            });
});

mocha.describe("DELETE/ Messages by id", () => {
    it ("it should delete a messages", (done) => {
        chai.request(server)
            .delete("/api/v1/messages/:messageId");
             done();
            });
});

mocha.describe("POST/messages", () => {
it("it should POST  message", (done) => {
    chai.request(server)
        .post("/api/v1/messages")
         done();
        });
});


//Test article router

describe("POST/articles", () => {
it("it should POST articles", (done) => {
    chai.request(server)
        .post("/api/v1/articles")
         done();
        });
});


describe("GET/articles", () => {
it("it should GET all articles", (done) => {
    chai.request(server)
        .get("/api/v1/articles")
         done();
        });
});


describe("GET/ articles/:postId", () => {
it("it should get an articles by id", (done) => {
    chai.request(server)
        .get("/api/v1/articles/:postId")
         done();
        });
});


describe("PATCH/ articles/:postId", () => {
it("it should update an articles", (done) => {
    chai.request(server)
        .patch("/api/v1/articles/:postId")
         done();
        });
});


describe("DELETE/articles/:postId", () => {
    it("it should delete an articles", (done) => {
        chai.request(server)
            .patch("/api/v1/articles/:postId")
             done();
        });
});


//test comments and likes routers 

describe("PUT /articles/:postId/like'", () => {
it("it should like an article", (done) => {
    chai.request(server)
        .put("/api/v1/article/:postId/like")
         done();
        });
});


describe("PUT/articles/:postId/comment", () => {
it("it should PUT a comment", (done) => {
    chai.request(server)
        .put("/articles/:title")
         done();
        });
});

//*
//test the PUT comment articles route
describe("PUT/articles/:_id", () => {
it("it should update article", (done) => {
    chai.request(server)
        .put("/articles/:_id")
         done();
        });
});



//test users authontication route

describe("POST /signup", () => {
it("it should signup", (done) => {
    chai.request(server)
        .post("/api/v1/users/signUp")
         done();
        });
});

describe("POST/ login", () => {
it("it should login", (done) => {
       chai.request(server)
        .post("/api/v1/users/login")
         done();
        });
});


describe("GET/ users ", () => {
    it("it should get all users", (done) => {
           chai.request(server)
            .get("/api/v1/users")
             done();
            });
});

describe("PATCH/ articles/:postId", () => {
    it("it should update user profile", (done) => {
        chai.request(server)
            .patch("/api/v1/users/:userId")
             done();
            });
});

describe("DELETE/ user", () => {
    it("it should delete user", (done) => {
               chai.request(server)
                .post("/api/v1/users/:userId")
                 done();
                });
});