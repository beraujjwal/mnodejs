'use strict';
const autoBind = require('auto-bind');
const { controller } = require('@controller/controller');
const validator = require('@helper/validate');

class VALIDATION_CAMEL_CASE_SINGULAR_FROMValidation extends controller {
  /**
   * Validation constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.User = this.db.User;
    this.Role = this.db.Role;
    this.regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    autoBind(this);
  }

  async sampleValidation(req, res, next) {
    const validationRule = {
      name: 'required|string',
      email: 'required|email|unique:User,email',
      phone: 'required|numeric|length:10|unique:User,phone',
      password: 'required|string|min:6',
    };

    let { name, email, phone, password } = req.body;

    await validator(
      { name, email, phone, password },
      validationRule,
      {},
      (err, status) => {
        if (!status) {
          this.ApiRes.validationErrorWithData(res, err);
        } else {
          next();
        }
      },
    );
  }
}
module.exports = new VALIDATION_CAMEL_CASE_SINGULAR_FROMValidation();
