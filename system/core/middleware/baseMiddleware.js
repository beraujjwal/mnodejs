'use strict';
const autoBind = require('auto-bind');
const { base } = require('../base');

const {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationError,
  unauthorizedResponse,
} = require('../helpers/apiResponse');

const { log, error, info } = require('../helpers/errorLogs');

class baseMiddleware extends base {
  /**
   * Base Controller Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.success = successResponse;
    this.notFound = notFoundResponse;
    this.error = errorResponse;
    this.validationError = validationError;
    this.unauthorized = unauthorizedResponse;
    this.log = log;
    this.errorLog = error;
    this.infoLog = info;
    autoBind(this);
  }
}

module.exports = { baseMiddleware };
