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
 
/*
 //Post articles 
 describe('create post', ()=>{
    let token;
    before(function(done){
      request
        .post('/api/v1/users/login')
        .send({
          email: "nibyoyvan61@gmail.com",
          password: "nibyoyvan61"
        })
        .end(function(err, res){
          if(err) throw err;
          token = {access_token: res.body.token}
          done();
        }).catch(done);
    });

    it('should create a new article', done => {
        const newArticle = {
          title: "this is new article",
          content: "the context of the first article"
        };
        request
          .post('/api/v1/articles')
          .send(newArticle)
          .query(token)
          .expect(201)
          .end(function(err, res){
            should(err).equal(null);
            done();
          })
    });
});

*/