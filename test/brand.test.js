const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const Users = require("../models/User");
const Articles = require("../models/Post");
const Messages = require("../models/Message.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Projects = require("../models/Project.js");

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const serChai = chai.request(server).keepOpen();

describe("My brand API Testing", () => {
  describe("Welcome to the API", () => {
    it("should return welcome text from server", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    }).timeout(30000);
  });

  before(async function () {
    // this.timeout(30000);

    if (mongoose.connection.readyState === 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const hashedPassword = await bcrypt.hash("julish123", 10);
    const adminData = {
      full_name: "Admin User",
      email: "julish123@gmail.com",
      password: hashedPassword,
      isAdmin: true,
    };
    await Users.findOneAndUpdate({ email: adminData.email }, adminData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  });

  after(async () => {
    try {
      await Users.deleteMany({ email: { $ne: "julish@gmail.com" } });
      await Articles.deleteMany({
        title: {
          $ne: "AI: The Quiet Force Reshaping Every Sector - and How Rwanda Is Leading the Charge.",
        },
      });
      await Messages.deleteMany({});
      console.log("Database cleaned. Admin preserved.");
      serChai.close();
    } catch (error) {
      console.error("Error cleaning up database:", error);
    }
  });

  describe("Should test users registration", () => {
    afterEach(async () => {
      await Users.deleteOne({ email: "julish1@gmail.com" });
    });

    it("should register a new user", (done) => {
      const user = {
        full_name: "Julien ishimwe",
        email: "julish1@gmail.com",
        password: "julish1234",
      };
      serChai
        .post("/api/v1/users/signUp")
        .send(user)
        .end((err, res) => {
          expect(res.status).to.be.equal(201);
          done();
        });
    }).timeout(25000);

    it("should throw a message, if the email already exist", (done) => {
      const user = {
        full_name: "Julio ish",
        email: "julish123@gmail.com",
        password: "julish123",
      };
      serChai
        .post("/api/v1/users/signUp")
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property("message", "Email already Exist");
          done();
        });
    }).timeout(30000);

    it("should throw error when there's validation error", (done) => {
      const user = {
        full_name: "Julius ish",
        email: "julishmail.com",
        password: "julish1233",
      };
      serChai
        .post("/api/v1/users/signUp")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    }).timeout(30000);
  });

  describe("User Login, Get users, Update Profile and delete", () => {
    it("should login and get all signed up user as Admin", (done) => {
      const userLogin = { email: "julish123@gmail.com", password: "julish123" };

      serChai
        .post("/api/v1/users/login")
        .send(userLogin)
        .end((err, res) => {
          if (err) return done(err);

          // DEBUG: Make sure login worked!
          if (res.status !== 200) {
            console.log("LOGIN FAILED:", res.body);
            return done(new Error("Login failed before admin test"));
          }

          res.should.have.status(200);
          let token = res.body.token;

          serChai
            .get("/api/v1/users")
            // FIXED: Use object format
            .set({ Cookie: `jwt=${token}` })
            .end((err, res) => {
              if (err) return done(err);

              // DEBUG: Check what the server says if it fails
              if (res.status !== 200) {
                console.log(
                  "ADMIN ROUTE FAILED. Status:",
                  res.status,
                  "Body:",
                  res.body,
                );
              }

              res.should.have.status(200);
              res.body.should.have.property("message", "All Users accounts");
              done();
            });
        });
    }).timeout(30000);

    it("should sign new user, Get one user & update profile", (done) => {
      const new_user = {
        full_name: "great eric",
        email: "greateric1@gmail.com",
        password: "greatEric123",
      };
      const update_user = {
        full_name: "great eric kanya",
        email: "greatkan2@gmail.com",
        password: "greatkany1234",
      };

      serChai
        .post("/api/v1/users/signUp")
        .send(new_user)
        .end((err, res) => {
          if (err) return done(err);
          const userId = res.body.data.user._id;

          serChai
            .post("/api/v1/users/login")
            .send({ email: "julish123@gmail.com", password: "julish123" })
            .end((err, res) => {
              if (err) return done(err);
              let token = res.body.token;

              serChai
                .patch(`/api/v1/users/${userId}`)
                .set({ Cookie: `jwt=${token}` }) // FIXED
                .send(update_user)
                .end((err, res) => {
                  if (err) return done(err);
                  expect(res.status).to.equal(200);
                  Users.deleteOne({ email: "greatkan2@gmail.com" }).exec();
                  done();
                });
            });
        });
    }).timeout(30000);

    it("should sign new user and delete", (done) => {
      const new_user = {
        full_name: "name emmy",
        email: "nameemmy@gmail.com",
        password: "nameemmy123",
      };

      serChai
        .post("/api/v1/users/signUp")
        .send(new_user)
        .end((err, res) => {
          if (err) return done(err);
          const userId = res.body.data.user._id;

          serChai
            .post("/api/v1/users/login")
            .send({ email: "julish123@gmail.com", password: "julish123" })
            .end((err, res) => {
              if (err) return done(err);
              let token = res.body.token;

              serChai
                .delete(`/api/v1/users/${userId}`)
                .set({ Cookie: `jwt=${token}` }) // FIXED
                .end((err, res) => {
                  if (err) return done(err);
                  expect(res.status).to.equal(200);
                  done();
                });
            });
        });
    }).timeout(30000);
  });

  describe("Authorization & Access Control", () => {
    let normalUserToken;

    // 1. Create a normal user and log them in BEFORE the test
    before(async () => {
      const normalUser = {
        full_name: "Normal User",
        email: "normaluser@gmail.com",
        password: "password123",
      };

      // Sign up the normal user
      await serChai.post("/api/v1/users/signUp").send(normalUser);

      // Log in to get their token
      const loginRes = await serChai.post("/api/v1/users/login").send({
        email: normalUser.email,
        password: normalUser.password,
      });

      normalUserToken = loginRes.body.token;
    });

    // 2. Cleanup the normal user after
    after(async () => {
      await Users.deleteOne({ email: "normaluser@gmail.com" });
    });

    it("should return 403 Forbidden when a normal user tries to access admin routes", async () => {
      const res = await serChai
        .get("/api/v1/users")
        .set({ Cookie: `jwt=${normalUserToken}` });

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("message", "Access Denied!");
    });
  });

  describe("Auth Middleware Edge Cases", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await serChai.get("/api/v1/users");
      expect(res.status).to.equal(401);
      expect(res.body.message).to.include("You are not logged in!");
    });

    it("should return 401 if an invalid token is provided", async () => {
      const res = await serChai
        .get("/api/v1/users")
        .set({ Cookie: "jwt=thisisnotarealtoken123" });
      expect(res.status).to.equal(401);
      expect(res.body.message).to.include(
        "Invalid token! Please log in again.",
      );
    });
  });

  describe("Article & Comments CREATE GET UPDATE DELETE", () => {
    let token;
    let postId;
    let commentId;

    before(async () => {
      const res = await serChai
        .post("/api/v1/users/login")
        .send({ email: "julish123@gmail.com", password: "julish123" });
      token = res.body.token;
    });

    afterEach(async () => {
      await Articles.deleteMany({ title: /ARTICLE Mocha TEST TEST/i });
      await Articles.deleteMany({ title: /This is the new article/i });
    });

    it("should CREATE article", async () => {
      const article = {
        title: "ARTICLE Mocha TEST TEST",
        content: "the context of the first article",
      };
      const res = await serChai
        .post("/api/v1/articles")
        .set({ Cookie: `jwt=${token}` })
        .send(article);

      expect(res.status).to.equal(201);
      postId = res.body.data._id;
    });

    it("should GET one article", async () => {
      const res = await serChai.get(`/api/v1/articles/${postId}`);
      expect(res.status).to.equal(200);
    });

    it("should add a comment to the article", async () => {
      const add_comment = { text: "This is cool topic ever!" };

      const res = await serChai
        .put(`/api/v1/articles/${postId}/comment`)
        .set({ Cookie: `jwt=${token}` })
        .send(add_comment);

      expect(res.status).to.equal(200);
      commentId = res.body.data.saveComment._id;
    });

    it("should GET the specific comment", async () => {
      const res = await serChai
        .get(`/api/v1/articles/comments/all/${commentId}`)
        .set({ Cookie: `jwt=${token}` });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Comment");
    });

    it("should DELETE the comment", async () => {
      const res = await serChai
        .delete(`/api/v1/articles/comments/all/${commentId}`)
        .set({ Cookie: `jwt=${token}` });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "comment deleted!");
    });

    it("should get all the articles in db", async () => {
      const res = await serChai.get("/api/v1/articles");
      expect(res.status).to.equal(200);
    });

    it("should add article, update and delete", async () => {
      const new_one = {
        title: "This is the new article to be updated",
        content: "content",
      };
      const update_one = { title: "Updated Article", content: "content" };

      const createRes = await serChai
        .post("/api/v1/articles")
        .set({ Cookie: `jwt=${token}` })
        .send(new_one);
      expect(createRes.status).to.equal(201);
      const newPostId = createRes.body.data._id;

      const updateRes = await serChai
        .patch(`/api/v1/articles/${newPostId}`)
        .set({ Cookie: `jwt=${token}` })
        .send(update_one);
      expect(updateRes.status).to.equal(200);

      const deleteRes = await serChai
        .delete(`/api/v1/articles/${newPostId}`)
        .set({ Cookie: `jwt=${token}` });
      expect(deleteRes.status).to.equal(200);
    });
  });

  describe("Test messages routes", () => {
    it("should GET all messages as an admin", (done) => {
      serChai
        .post("/api/v1/users/login")
        .send({ email: "julish123@gmail.com", password: "julish123" })
        .end((err, res) => {
          let token = res.body.token;
          serChai
            .get("/api/v1/messages")
            .set({ Cookie: `jwt=${token}` })
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).to.be.equal(200);
              done();
            });
        });
    }).timeout(30000);

    it("should submit message GET one and DELETE", (done) => {
      const submit_msg = {
        name: "rutirirwa paul",
        email: "rwegoabata@gmail.com",
        message: "Hello, I like your project",
      };

      serChai
        .post("/api/v1/users/login")
        .send({ email: "julish123@gmail.com", password: "julish123" })
        .end((err, res) => {
          let token = res.body.token;
          serChai
            .post("/api/v1/messages")
            .send(submit_msg)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).to.be.equal(201);
              const messageId = res.body.data.message._id;

              serChai
                .get(`/api/v1/messages/${messageId}`)
                .set({ Cookie: `jwt=${token}` })
                .end((err, res) => {
                  if (err) return done(err);
                  expect(res.status).to.equal(200);

                  serChai
                    .delete(`/api/v1/messages/${messageId}`)
                    .set({ Cookie: `jwt=${token}` })
                    .end((err, res) => {
                      if (err) return done(err);
                      expect(res.status).to.equal(200);
                      done();
                    });
                });
            });
        });
    }).timeout(30000);
  });

  describe("Test comments routes", () => {
    it("should GET all commet as an admin", (done) => {
      serChai
        .post("/api/v1/users/login")
        .send({ email: "julish123@gmail.com", password: "julish123" })
        .end((err, res) => {
          let token = res.body.token;
          serChai
            .get("/api/v1/articles/comments/all")
            .set({ Cookie: `jwt=${token}` })
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).to.be.equal(200);
              done();
            });
        });
    }).timeout(30000);
  });

  describe("Test Project Work API", () => {
    let token;
    let projectId;
    before(async () => {
      const res = await serChai
        .post("/api/v1/users/login")
        .send({ email: "julish123@gmail.com", password: "julish123" });
      token = res.body.token;
    });

    afterEach(async () => {
      await Projects.deleteMany({ title: /Test Project/i });
    });

    it("should create a new project without images (Admin only)", async () => {
      const newProject = {
        title: "Test Project One",
        description: "A test project description",
        techStack: "React, Node.Js, MongoDB",
        githubLink: "https://github.com/test",
        liveLink: "https://test.com",
      };
      const res = await serChai
        .post("/api/v1/projects")
        .set({ Cookie: `jwt=${token}` })
        .send(newProject);

      expect(res.status).to.equal(201);
      expect(res.body.data.title).to.equal(newProject.title);
      expect(res.body.data.techStack).to.be.an("array").that.include("React");
      expect(res.body.data.projectImages).to.be.an("array").that.is.empty;

      projectId = res.body.data._id;
    });

    it("should create a new project with images (Admin only)", async () => {
      const res = await serChai
        .post("/api/v1/projects")
        .set({ Cookie: `jwt=${token}` })
        .field("title", "Test Project With Images")
        .field("techStack", "HTML, CSS, JS")
        .attach("projectImages", "")
        .attach("projectImages", "");

      expect(res.status).to.equal(201);
      expect(res.body.data.projectImages)
        .to.be.an("array")
        .that.has.lengthOf(2);
      expect(res.body.data.projectImages[0]).to.include("cloudinary.com");
    });

    it("should get all projects (Public route)", async () => {
      const res = await serChai.get("/api/v1/projects");

      expect(res.status).to.equal(200);
      expect(res.body.results).to.be.a("number");
      expect(res.body.data).to.be.an("array");
    });
  });
});
