const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

/**
 * Test cases to test all the resource APIs
 * Covered Routes:
 * (1) Login
 * (2) Get all resources
 * (3) Store resource
 * (4) Get single resource
 * (5) Update resource
 * (6) Delete resource
 */

describe('Resource', () => {
  //Before each test we empty the database
  /*before((done) => {
    db.Resource.deleteMany({}, (err) => {
      done();
    });
  });*/

  // Prepare data for testing
  const userTestData = {
    password: '123456',
    username: 'bera.usha@hotmail.com',
  };
  var loginResponse, resourceData;

  // Prepare data for testing
  const testData = {
    name: 'Gest',
  };

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for resource', (done) => {
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
          res.body.should.have
            .property('message')
            .eql('User login successfully!');
          loginResponse = res.body.data;
          done();
        });
    });
  });

  /*
   * Test the /GET route
   */
  describe('/GET All resources', () => {
    it('it should GET all the resources', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/resources')
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Resource list got successfully!');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST Resource store blank data submited', () => {
    it('It should send validation error for store resource', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/resource')
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
  describe('/POST Resource store', () => {
    it('It should store resource', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/resource')
        .send(testData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          resourceData = res.body.data;
          res.body.should.have
            .property('message')
            .eql('Resource details stored successfully!');
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id resource', () => {
    it('it should GET the resources', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/resource/' + resourceData.id)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Resource details fetched successfully!');
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id resource', () => {
    it('it should PUT the resources', (done) => {
      chai
        .request(server)
        .put('/api/v1.0/resource/' + resourceData.id)
        .send(testData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Resource details updated successfully!');
          done();
        });
    });
  });

  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id resource', () => {
    it('it should DELETE the resources', (done) => {
      chai
        .request(server)
        .delete('/api/v1.0/resource/' + resourceData.id)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Resource details deleted successfully!');
          done();
        });
    });
  });

  after((done) => {
    db.Resource.deleteOne({ _id: resourceData.id }, (err) => {
      done();
    });
  });
});
