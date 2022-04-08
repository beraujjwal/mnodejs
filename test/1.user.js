'use strict';
const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Login
 * (2) Register
 * (3) Verify user
 */

describe('User', () => {
  // Before each test we should store some required
  before((done) => {
    db.User.deleteMany({}, (err) => {
      console.log(err);
      db.Token.deleteMany({});
      done();
    });
  });

  // Prepare data for testing
  const testData = {
    name: 'John Doe',
    email: 'john.doe@mail.com',
    phone: '9874563210',
    password: '123456',
    roles: ['subscriber'],
  };

  const rootUserData = {
    name: 'Anna Jones',
    email: 'anna.jones@mail.com',
    phone: '9874563211',
    password: '123456',
    roles: ['administrator'],
  };
  var newTestData;
  var newRootUserData;
  const createdID = [];

  /*
   * Test the /POST route
   */
  describe('1) /POST Register user only with email', () => {
    it('It should send validation error for Register', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signup')
        .send({ email: testData.email })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(true);
          res.body.should.have.property('message').eql('Validation failed');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('2) /POST Register user with required data', () => {
    it('It should Register user', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signup')
        .send(testData)
        .end((err, res) => {
          res.should.have.status(200);
          //res.body.should.have.property('error').eql(false);
          //res.body.should.have.property('code').eql(200);
          res.body.should.have
            .property('message')
            .eql('User created successfully!');
          newTestData = res.body.data;
          createdID.push(newTestData.token.user);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('3) /POST Login user before verify', () => {
    it('it should Send account not verified.', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: testData.email, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('code').eql(400);
          res.body.should.have.property('error').eql(true);
          /*res.body.should.have
            .property('message')
            .eql(
              'You have not yet verified your account. Please verify your account.',
            );*/
          done();
        });
    });
  });

  /*
   * Test the /GET route
   */
  describe('4) /GET verified by url', () => {
    it('It should verified', (done) => {
      chai
        .request(server)
        .get(
          `/auth/verify/${newTestData.token.user}/${newTestData.token.token}`,
        )
        .end((err, res) => {
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('5) /POST Login user only with email', () => {
    it('It should send validation error for Login', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: testData.email })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(true);
          /*res.body.should.have
            .property('message')
            .eql(
              'You have submitted invalid login details.',
            );*/
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('6) /POST Login user only with phone', () => {
    it('It should send validation error for Login', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: testData.phone })
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
  describe('7) /POST Login user with wrong username & password', () => {
    it('it should Send failed user Login', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: 'admin@admin.com', password: '1234' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(true);
          res.body.should.have
            .property('message')
            .eql('We are unable to find your account with the given details.');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('8) /POST Login user with wrong password', () => {
    it('it should Send failed user Login', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: testData.email, password: '1234' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(true);
          res.body.should.have
            .property('message')
            .eql('You have submitted invalid login details.');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('9) /POST Login user with correct email & password', () => {
    it('it should do user Login', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: testData.email, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('User login successfully!');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('10) /GET Login user with correct email & password', () => {
    it('it should do user Login', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: testData.email, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('User login successfully!');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('11) /POST Login user with correct phone & password', () => {
    it('it should do user Login', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send({ username: testData.phone, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('User login successfully!');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('12) /POST Register user with root access', () => {
    it('It should Register user', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signup')
        .send(rootUserData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          res.body.should.have
            .property('message')
            .eql('User created successfully!');
          newRootUserData = res.body.data;
          done();
        });
    });
  });

  /*
   * Test the /GET route
   */
  describe('13) /GET root user verified by url', () => {
    it('It should verified', (done) => {
      chai
        .request(server)
        .get(
          `/auth/verify/${newRootUserData.token.user}/${newRootUserData.token.token}`,
        )
        .end((err, res) => {
          done();
        });
    });
  });

  after(() => {
    createdID.forEach((id) => {
      db.User.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
});
