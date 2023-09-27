'use strict';
require('dotenv').config();

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../system/core');
let should = chai.should();
chai.use(chaiHttp);

//Export this to use in multiple files
module.exports = {
  chai: chai,
  server: server,
  should: should,
};
