//During the automated test the env variable, We will set it to "test"
process.env.APP_PORT = '8081';
process.env.NODE_ENV = 'test';
process.env.DB_CONNECTION = 'mongodb';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '27017';
process.env.DB_DATABASE = 'mnode-test';
process.env.DB_USERNAME = 'mnode';
process.env.DB_PASSWORD = 'mnode@pp';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../');
let should = chai.should();
chai.use(chaiHttp);

//Export this to use in multiple files
module.exports = {
  chai: chai,
  server: server,
  should: should,
};
