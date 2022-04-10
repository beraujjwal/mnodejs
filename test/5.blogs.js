const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

/**
 * Test cases to test all the blog APIs
 * Covered Routes:
 * (1) Login
 * (2) Get all blogs
 * (3) Store blog
 * (4) Get single blog
 * (5) Update blog
 * (6) Delete blog
 */

describe('Blog', () => {
  //Before each test we empty the database
  /*before((done) => {
    db.Blog.deleteMany({}, (err) => {
      done();
    });
  });*/

  // Prepare data for testing
  const userTestData = {
    password: '123456',
    username: 'anna.jones@mail.com',
  };
  var loginResponse, blogData;

  // Prepare data for testing
  const testData = {
    name: 'Lorem ipsum dolor sit amet',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non velit fermentum, lacinia mauris ut, bibendum sapien. Nunc gravida massa nunc, pulvinar gravida elit condimentum eu. Sed convallis magna ut velit viverra, nec accumsan neque dictum. Pellentesque vitae sem quam. In nec blandit nibh, et luctus odio. Maecenas auctor purus efficitur varius malesuada. Maecenas elementum eleifend libero, vel facilisis diam rutrum sit amet. Phasellus lacinia nulla elementum, euismod erat ut, tristique ante.',
    publish: true,
  };
  const createdID = [];

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for blog', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({
          username: userTestData.username,
          password: userTestData.password,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          loginResponse = res.body.data;
          done();
        });
    });
  });

  /*
   * Test the /GET route
   */
  describe('/GET All blogs', () => {
    it('it should GET all the blogs', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/blogs')
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST Blog store blank data submited', () => {
    it('It should send validation error for store blog', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/blog')
        .send()
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(true);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST Blog store', () => {
    it('It should store blog', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/blog')
        .send(testData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          blogData = res.body.data;
          createdID.push(blogData.id);
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id blog', () => {
    it('it should GET the blogs', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/blog/' + blogData.id)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id blog', () => {
    it('it should not update the blogs', (done) => {
      chai
        .request(server)
        .put('/api/v1.0/blog/' + blogData.id)
        .send()
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(true);
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id blog', () => {
    it('it should PUT the blogs', (done) => {
      let updatedTestData = { ...testData, status: true };
      chai
        .request(server)
        .put('/api/v1.0/blog/' + blogData.id)
        .send(updatedTestData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          done();
        });
    });
  });

  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id blog', () => {
    it('it should DELETE the blogs', (done) => {
      chai
        .request(server)
        .delete('/api/v1.0/blog/' + blogData.id)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          done();
        });
    });
  });

  after((done) => {
    createdID.forEach((id) => {
      db.Blog.findByIdAndRemove(id);
    });
    done();
  });
});
