'use strict';
const autoBind = require('auto-bind');
const { base } = require('../base');
const validator = require('../helpers/validate');

const { validationError } = require('../helpers/apiResponse');

const { log, error, info } = require('../helpers/errorLogs');

class baseValidation extends base {
  /**
   * Base Controller Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.validationError = validationError;

    this.log = log;
    this.errorLog = error;
    this.infoLog = info;
    autoBind(this);
  }

  async validate(req, res, next, validationRule, customMessages = {}) {
    await validator(req.body, validationRule, customMessages, (err, status) => {
      if (!status) {
        return res.status(200).json(this.validationError(err));
      } else {
        next();
      }
    });
  }
}

module.exports = { baseValidation };
