'use strict';
const autoBind = require('auto-bind');
const { validation } = require('./validation');

class blogValidation extends validation {
  /**
   * Validation constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    autoBind(this);
  }

  async create(req, res, next) {
    const validationRule = {
      name: 'required|string',
      content: 'required|string',
      publish: 'required|boolean',
    };
    return await this.validate(req, res, next, validationRule);
  }

  async update(req, res, next) {
    const validationRule = {
      name: 'required|string',
      content: 'required|string',
      publish: 'required|boolean',
      status: 'required|boolean',
    };
    return await this.validate(req, res, next, validationRule);
  }
}
module.exports = new blogValidation();
