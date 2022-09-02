const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

const { log, error, info } = require('../system/core/helpers/errorLogs');

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
		if (err) error(err);
      done();
    });
  });*/

  // Prepare data for testing
  const userTestData = {
    password: '123456',
    username: 'anna.jones@mail.com',
  };
  var loginResponse, resourceData;

  // Prepare data for testing
  const testData = {
    name: 'Gest',
  };
  const createdID = [];

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
          if (err) error(err);
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
  describe('/GET All resources', () => {
    it('it should GET all the resources', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/resources')
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
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
          if (err) error(err);
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
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          resourceData = res.body.data;
          createdID.push(resourceData.id);
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
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id resource', () => {
    it('it should not update the resources', (done) => {
      chai
        .request(server)
        .put('/api/v1.0/resource/' + resourceData.id)
        .send()
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(true);
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id resource', () => {
    it('it should PUT the resources', (done) => {
      let updatedTestData = { ...testData, status: true };
      chai
        .request(server)
        .put('/api/v1.0/resource/' + resourceData.id)
        .send(updatedTestData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
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
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          done();
        });
    });
  });

  after((done) => {
    createdID.forEach((id) => {
      db.Resource.findByIdAndRemove(id);
    });
    done();
  });
});
