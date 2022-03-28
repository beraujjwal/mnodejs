'use strict';
const autoBind = require('auto-bind');
const { controller } = require('@controller/controller');
const validator = require('@helper/validate');

class userValidation extends controller {
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

  async signup(req, res, next) {
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
        console.log('VALIDATION CALLED');
        if (!status) {
          this.ApiRes.validationErrorWithData(res, err);
        } else {
          next();
        }
      },
    );
  }

  async verify(req, res, next) {
    let rule = req.body.username.match(this.regexEmail)
      ? 'required|email'
      : 'required|numeric';
    const validationRule = {
      username: rule,
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, err);
      } else {
        next();
      }
    });
  }

  async signin(req, res, next) {
    const validationRule = {
      username: 'required',
      password: 'required',
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, err);
      } else {
        next();
      }
    });
  }

  async profile(req, res, next) {
    var userId = req.user.id;
    const validationRule = {
      name: 'required|string',
      email: 'required|email|unique:User,email,_id,' + userId,
      phone: 'required|string|unique:User,phone,_id,' + userId,
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, err);
      } else {
        next();
      }
    });
  }

  async forgotPassword(req, res, next) {
    const validationRule = {
      username: 'required',
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, err);
      } else {
        next();
      }
    });
  }

  async changePassword(req, res, next) {
    const validationRule = {
      old_password: 'required',
      password: 'required',
      password_confirmation: 'required',
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, err);
      } else {
        next();
      }
    });
  }
}
module.exports = new userValidation();
