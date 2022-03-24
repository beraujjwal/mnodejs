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
      phone: 'required|numeric|unique:User,phone',
      password: 'required|string|min:6',
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        this.ApiRes.validationErrorWithData(res, 'Validation failed', err);
      } else {
        next();
      }
    });
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
        this.ApiRes.validationErrorWithData(res, 'Validation failed', err);
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
        this.ApiRes.validationErrorWithData(res, 'Validation failed', err);
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
        this.ApiRes.validationErrorWithData(res, 'Validation failed', err);
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
        this.ApiRes.validationErrorWithData(res, 'Validation failed', err);
      } else {
        next();
      }
    });
  }
}
module.exports = new userValidation();
