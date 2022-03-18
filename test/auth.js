/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test';

const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const User = require('../models/user.model');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const registerDetails = {
  name: 'Usha Bera',
  email: 'bera.usha@hotmail.com',
  phone: '9475967638',
  password: '123456',
};
const loginDetails = {
  username: 'bera.usha@hotmail.com',
  password: '123456',
};
let token = '';
const createdID = [];
let verification = '';
let verificationForgot = '';
const email = 'bera.usha@hotmail.com';

chai.use(chaiHttp);

describe('*********** AUTH ***********', () => {
  describe('/GET /', () => {
    it('it should GET home API url', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  /*describe('/GET /404url', () => {
    it('it should GET 404 url', (done) => {
      chai
        .request(server)
        .get('/404url')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          done();
        });
    });
  });*/

  describe('/POST signup', () => {
    it('it should POST register', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signup')
        .send(registerDetails)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.include.keys('token', 'user');
          createdID.push(res.body.user._id);
          verification = res.body.user.verification;
          done();
        });
    });
    it('it should NOT POST a register if email already exists', (done) => {
      chai
        .request(server)
        .post('/register')
        .send(registerDetails)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          done();
        });
    });
  });

  describe('/POST signin', () => {
    it('it should GET token', (done) => {
      chai
        .request(server)
        .post('/api/v1.0/auth/signin')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });

  describe('/POST verify', () => {
    it('it should POST verify', (done) => {
      chai
        .request(server)
        .post('/verify')
        .send({
          id: verification,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.include.keys('email', 'verified');
          res.body.verified.should.equal(true);
          done();
        });
    });
  });

  describe('/POST forgot', () => {
    it('it should POST forgot', (done) => {
      chai
        .request(server)
        .post('/forgot')
        .send({
          email,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.include.keys('msg', 'verification');
          verificationForgot = res.body.verification;
          done();
        });
    });
  });

  describe('/POST reset', () => {
    it('it should POST reset', (done) => {
      chai
        .request(server)
        .post('/reset')
        .send({
          id: verificationForgot,
          password: '12345',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('msg').eql('PASSWORD_CHANGED');
          done();
        });
    });
  });

  describe('/GET token', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get('/token')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .get('/token')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('token');
          done();
        });
    });
  });

  after(() => {
    createdID.forEach((id) => {
      User.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
});
