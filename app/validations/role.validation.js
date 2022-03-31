'use strict';
const autoBind = require('auto-bind');
const { controller } = require('@controller/controller');
const validator = require('@helper/validate');

class roleValidation extends controller {
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
    };

    let { name } = req.body;

    await validator({ name }, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, err);
      } else {
        next();
      }
    });
  }

  async update(req, res, next) {
    const validationRule = {
      name: 'required|string',
    };

    let { name } = req.body;

    await validator({ name }, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, err);
      } else {
        next();
      }
    });
  }
}
module.exports = new roleValidation();
