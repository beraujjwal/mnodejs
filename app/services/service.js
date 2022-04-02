'use strict';
const autoBind = require('auto-bind');
const jwt = require('jsonwebtoken');
const { baseService } = require('@core/service/baseService');
const { ApiResponse } = require('@helper/apiResponse');

const mailer = require('../helpers/mailer');
//const crypto = require("crypto");

class service extends baseService {
  /**
   * Service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.mailer = mailer;
    this.model = this.db[model];
    //this.crypto = crypto;
    this.ApiRes = new ApiResponse();
    autoBind(this);
  }

  async isUnique(model, key, value, id = null) {
    const query = [];

    value = value.toLowerCase();
    value = value.replace(/[^a-zA-Z ]/g, '');
    value = value.replace(/[^a-zA-Z]/g, '-');

    if (value) {
      query.push({
        [key]: {
          [this.Op.eq]: value,
        },
      });
    }

    if (id != null) {
      query.push({
        id: {
          [this.Op.ne]: id,
        },
      });
    }

    return model.findOne({
      where: {
        [this.Op.and]: query,
      },
    });
  }

  async generateToken(userInfo, algorithm = 'HS256') {
    try {
      // Gets expiration time
      const expiration =
        Math.floor(Date.now() / 1000) + 60 * this.env.JWT_EXPIRES_IN;

      return jwt.sign(userInfo, this.env.JWT_SECRET, {
        expiresIn: expiration, // expiresIn time
        algorithm: algorithm,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sentMail(userInfo, algorithm = 'HS256') {
    try {
      // Gets expiration time
      const expiration =
        Math.floor(Date.now() / 1000) + 60 * this.env.JWT_EXPIRES_IN;

      return jwt.sign(userInfo, this.env.JWT_SECRET, {
        expiresIn: expiration, // expiresIn time
        algorithm: algorithm,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = { service };
