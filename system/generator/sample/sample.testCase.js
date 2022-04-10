const { chai, server, should } = require('./testConfig');
const db = require('../system/core/model');

/**
 * Test cases to test all the SINGULAR_SAMLL_CASE APIs
 * Covered Routes:
 * (1) Login
 * (2) Get all PLURAL_SAMLL_CASE
 * (3) Store SINGULAR_SAMLL_CASE
 * (4) Get single SINGULAR_SAMLL_CASE
 * (5) Update SINGULAR_SAMLL_CASE
 * (6) Delete SINGULAR_SAMLL_CASE
 */

describe('MODEL_SINGULAR_FORM', () => {
  //Before each test we empty the database
  /*before((done) => {
    db.MODEL_SINGULAR_FORM.deleteMany({}, (err) => {
      done();
    });
  });*/

  // Prepare data for testing
  const userTestData = {
    password: '123456',
    username: 'anna.jones@mail.com',
  };
  var loginResponse, SINGULAR_SAMLL_CASEData;

  // Prepare data for testing
  const testData = {
    name: 'Lorem ipsum dolor sit amet',
  };
  const createdID = [];

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should do user Login for SINGULAR_SAMLL_CASE', (done) => {
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
  describe('/GET All PLURAL_SAMLL_CASE', () => {
    it('it should GET all the PLURAL_SAMLL_CASE', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/PLURAL_SAMLL_CASE')
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
  describe('/POST MODEL_SINGULAR_FORM store blank data submited', () => {
    it('It should send validation error for store SINGULAR_SAMLL_CASE', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/SINGULAR_SAMLL_CASE')
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
  describe('/POST MODEL_SINGULAR_FORM store', () => {
    it('It should store SINGULAR_SAMLL_CASE', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/SINGULAR_SAMLL_CASE')
        .send(testData)
        .set('x-access-token', loginResponse.accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('error').eql(false);
          SINGULAR_SAMLL_CASEData = res.body.data;
          createdID.push(SINGULAR_SAMLL_CASEData.id);
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id SINGULAR_SAMLL_CASE', () => {
    it('it should GET the SINGULAR_SAMLL_CASE', (done) => {
      chai
        .request(server)
        .get('/api/v1.0/SINGULAR_SAMLL_CASE/' + SINGULAR_SAMLL_CASEData.id)
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
  describe('/PUT/:id SINGULAR_SAMLL_CASE', () => {
    it('it should not update the SINGULAR_SAMLL_CASE', (done) => {
      chai
        .request(server)
        .put('/api/v1.0/SINGULAR_SAMLL_CASE/' + SINGULAR_SAMLL_CASEData.id)
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
  describe('/PUT/:id SINGULAR_SAMLL_CASE', () => {
    it('it should PUT the SINGULAR_SAMLL_CASE', (done) => {
      let updatedTestData = { ...testData, status: true };
      chai
        .request(server)
        .put('/api/v1.0/SINGULAR_SAMLL_CASE/' + SINGULAR_SAMLL_CASEData.id)
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
  describe('/DELETE/:id SINGULAR_SAMLL_CASE', () => {
    it('it should DELETE the SINGULAR_SAMLL_CASE', (done) => {
      chai
        .request(server)
        .delete('/api/v1.0/SINGULAR_SAMLL_CASE/' + SINGULAR_SAMLL_CASEData.id)
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
      db.MODEL_SINGULAR_FORM.findByIdAndRemove(id);
    });
    done();
  });
});
