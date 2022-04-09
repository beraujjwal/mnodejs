const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

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
  describe('/GET All roles', () => {
    it('it should GET all the roles', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/roles')
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Role list got successfully!');
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
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          roleData = res.body.data;
          res.body.should.have
            .property('message')
            .eql('Role details stored successfully!');
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
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Role details fetched successfully!');
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id role', () => {
    it('it should PUT the roles', (done) => {
      chai
        .request(server)
        .put('/api/v1.0/role/' + roleData.id)
        .send(testData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Role details updated successfully!');
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
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('Role details deleted successfully!');
          done();
        });
    });
  });

  after((done) => {
    createdID.forEach((id) => {
      db.Role.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    db.Role.deleteOne({ _id: roleData.id }, (err) => {
      done();
    });
  });
});
