'use strict';
const autoBind = require('auto-bind');
const { base } = require('../base');
const validator = require('../helpers/validate');
const { validationError } = require('../helpers/apiResponse');
class baseValidation extends base {
  /**
   * Base Controller Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    autoBind(this);
  }

  async validate(req, res, next, validationRule, customMessages = {}) {
    await validator(req.body, validationRule, customMessages, async(err, status) => {
      if (!status) {
        return res.status(412).json(validationError(err));
      } else {
        next();
      }
    });
  }
}

module.exports = { baseValidation };