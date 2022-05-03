const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

const { log, error, info } = require('../system/core/helpers/errorLogs');

/**
 * Test cases to test all the role APIs
 * Covered Routes:
 * (1) Login
 * (2) Get all roles
 * (3) Store role
 * (4) Get single role
 * (5) Update role
 * (6) Delete role
 */

describe('Role', () => {
  //Before each test we empty the database
  /*before((done) => {
    db.Role.deleteMany({}, (err) => {
		if (err) error(err);
      done();
    });
  });*/

  // Prepare data for testing
  const userTestData = {
    password: '123456',
    username: 'anna.jones@mail.com',
  };
  var loginResponse, roleData;

  // Prepare data for testing
  const testData = {
    name: 'Gest',
    rights: [
      {
        resource: 'root',
        deny: true,
      },
    ],
  };
  const createdID = [];

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for role', (done) => {
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
  describe('/GET All roles', () => {
    it('it should GET all the roles', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/roles')
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
  describe('/POST Role store blank data submited', () => {
    it('It should send validation error for store role', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/role')
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
  describe('/POST Role store', () => {
    it('It should store role', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/role')
        .send(testData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          if (err) error(err);
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          roleData = res.body.data;
          createdID.push(roleData.id);
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id role', () => {
    it('it should GET the roles', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/role/' + roleData.id)
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
  describe('/PUT/:id role', () => {
    it('it should not update the roles', (done) => {
      chai
        .request(server)
        .put('/api/v1.0/role/' + roleData.id)
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
  describe('/PUT/:id role', () => {
    it('it should PUT the roles', (done) => {
      let updatedTestData = { ...testData, status: true };
      chai
        .request(server)
        .put('/api/v1.0/role/' + roleData.id)
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
  describe('/DELETE/:id role', () => {
    it('it should DELETE the roles', (done) => {
      chai
        .request(server)
        .delete('/api/v1.0/role/' + roleData.id)
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
      db.Role.findByIdAndRemove(id);
    });
    done();
  });
});
