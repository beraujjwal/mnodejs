const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

const { log, error, info } = require('../system/core/helpers/errorLogs');

/**
 * Test cases to test all the permission APIs
 * Covered Routes:
 * (1) Login
 * (2) Get all permissions
 * (3) Store permission
 * (4) Get single permission
 * (5) Update permission
 * (6) Delete permission
 */

describe('Permission', () => {
  //Before each test we empty the database
  /*before((done) => {
    db.Permission.deleteMany({}, (err) => {
		if (err) error(err);
      done();
    });
  });*/

  // Prepare data for testing
  const userTestData = {
    password: '123456',
    username: 'anna.jones@mail.com',
  };
  var loginResponse, permissionData;

  // Prepare data for testing
  const testData = {
    name: 'Gest',
  };
  const createdID = [];

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for permission', (done) => {
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
  describe('/GET All permissions', () => {
    it('it should GET all the permissions', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/permissions')
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
  describe('/POST Permission store blank data submited', () => {
    it('It should send validation error for store permission', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/permission')
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
  describe('/POST Permission store', () => {
    it('It should store permission', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/permission')
        .send(testData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          permissionData = res.body.data;
          createdID.push(permissionData.id);
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id permission', () => {
    it('it should GET the permissions', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/permission/' + permissionData.id)
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
  describe('/PUT/:id permission', () => {
    it('it should not update the permissions', (done) => {
      chai
        .request(server)
        .put('/api/v1.0/permission/' + permissionData.id)
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
  describe('/PUT/:id permission', () => {
    it('it should PUT the permissions', (done) => {
      let updatedTestData = { ...testData, status: true };
      chai
        .request(server)
        .put('/api/v1.0/permission/' + permissionData.id)
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
  describe('/DELETE/:id permission', () => {
    it('it should DELETE the permissions', (done) => {
      chai
        .request(server)
        .delete('/api/v1.0/permission/' + permissionData.id)
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
      db.Permission.findByIdAndRemove(id);
    });
    done();
  });
});
