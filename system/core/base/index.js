'use strict';
const autoBind = require('auto-bind');
const db = require('../model');
require('dotenv').config();

const { 
  BadRequestError, 
  UnauthorizedError, 
  PaymentRequiredError, 
  ForbiddenError, 
  NotFoundError, 
  MethodNotAllowedError, 
  InternalServerError, 
  BadGatewayError, 
  ServiceUnavailableError, 
  CommonError 
} = require('../errorHandler/baseError')

class index {
  /**
   * Base Controller Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    this.db = db;
    this.transaction = db.trans;
    this.env = process.env;
    autoBind(this);
  }

  async BadRequestError(message, code = 400) {
    throw new BadRequestError(message, code);
  }
  
  async UnauthorizedError(message, code = 401) {
    throw new UnauthorizedError(message, code);
  }
  
  async PaymentRequiredError(message, code = 402) {
    throw new PaymentRequiredError(message, code);
  }
  
  async ForbiddenError(message, code = 403) {
    throw new ForbiddenError(message, code);
  }

  async NotFoundError(message, code = 404) {
    throw new NotFoundError(message, code);
  }
  
  async MethodNotAllowedError(message, code = 405) {
    throw new MethodNotAllowedError(message, code);
  }
  
  async InternalServerError(message, code = 500) {
    throw new InternalServerError(message, code);
  }
  
  async BadGatewayError(message, code = 502) {
    throw new BadGatewayError(message, code);
  }

  async ServiceUnavailableError(message, code = 503) {
    throw new ServiceUnavailableError(message, code);
  }
  
  async CommonError(message, code) {
    throw new CommonError(message, code);
  }
}

module.exports = { base: index };
