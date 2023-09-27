'use strict';
const autoBind = require('auto-bind');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { baseService } = require('@core/service/baseService');
const { baseError } = require('@error/baseError');
const mailer = require('../helpers/mailer');

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
    this.transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };
    //this.crypto = crypto;
    autoBind(this);
  }

  async removeDuplicates(arr) {
    try {
      return [...new Set(arr)];
      //return arr.filter((item, index) => arr.indexOf(item) === index);
    } catch (error) {
      throw new baseError(error.message);
    }
  }

  async updateNestedStatus(rootId, newStatus) {
    try {
      // Update status of the current node
      await this.model.updateOne({ _id: rootId }, { $set: { status: newStatus } });
  
      // Find children of the current node
      const children = await this.model.find({ parent: rootId });
  
      // Recursively update status for each child
      for (const child of children) {
        await this.updateNestedStatus(child._id, newStatus);
      }
    } catch (error) {
      throw new baseError(error.message);
    }
  }

  async listToTree(list) {
    try {
      const map = {};
      const roots = [];
  
      for (let i = 0; i < list.length; i += 1) {
        map[list[i]._id] = i;
        list[i].childrens = [];
      }
      
      for (let i = 0; i < list.length; i += 1) {
        const node = list[i];
        if (node.parent !== null && map[node.parent] !== undefined) {
          list[map[node.parent]].childrens.push(node);
        } else {
          roots.push(node);
        }
      }
  
      return roots;
    } catch (error) {
      throw new baseError(error.message);
    }
  }

  async modifyIds(data) {
    try {
      return data.map(item => {
        const { _id, ...rest } = item;
        const newItem = { id: _id, ...rest };
    
        // Recursively modify subchildren
        for (const key in newItem) {
          if (Array.isArray(newItem[key])) {
            newItem[key].push(this.modifyIds(newItem[key]));
          }
        }
    
        return newItem;
      });
    } catch (error) {
      throw new baseError(error.message);
    }
  }

  async userFinalRights( roles, rights ) {
    try {
      const token = await this.generateToken({id, email, phone, tokenSalt});
      const refreshToken = await this.generateRefreshToken({id});
      const expiresInTime = await this.getExpiresInTime();
      const accessToken = {
        tokenType: 'Bearer',
        accessToken: token,
        refreshAccessToken: refreshToken,
        expiresIn: expiresInTime
      }

      return accessToken;
    } catch (error) {
      throw new baseError(error.message);
    }
  }


  async generateAccessToken( id, email, phone, tokenSalt ) {
    try {
      const token = await this.generateToken({id, email, phone, tokenSalt});
      const refreshToken = await this.generateRefreshToken({id});
      const expiresInTime = await this.getExpiresInTime();
      const accessToken = {
        tokenType: 'Bearer',
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: expiresInTime,
      }

      return accessToken;
    } catch (error) {
      throw new baseError(error.message);
    }
  }


  async getExpiresInTime() {
    const expiresIn = this.env.JWT_EXPIRES_IN;
    const expiresInInt = parseInt(expiresIn);
    const expiresInString = expiresIn.split(expiresInInt)[1];
    const expiresInTime = moment().utc(this.env.APP_TIMEZONE).add(expiresInInt, expiresInString).toDate();
    return expiresInTime;
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
      const expiration = this.env.JWT_EXPIRES_IN;
      console.log(expiration);

      return jwt.sign(userInfo, this.env.JWT_SECRET, {
        expiresIn: expiration, // expiresIn time
        algorithm: algorithm,
      });
    } catch (error) {
      throw new baseError(error.message);
    }
  }

  async generateRefreshToken(userInfo, algorithm = 'HS256') {
    try {
      // Gets expiration time
      const expiration = this.env.JWT_REFRESH_IN;
      
      return jwt.sign(userInfo, this.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: expiration, // expiresIn time
        algorithm: algorithm,
      });
    } catch (error) {
      throw new baseError(error.message);
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
      throw new baseError(error.message);
    }
  }

  async randomNumber(length) {
    var text = '';
    var possible = '123456789';
    for (var i = 0; i < length; i++) {
      var sup = Math.floor(Math.random() * possible.length);
      text += i > 0 && sup == i ? '0' : possible.charAt(sup);
    }
    return Number(text);
  };
  
  async generatePassword (
    length,
    { digits = true, lowerCase = true, upperCase = true, specialChars = true },
  ) {
    return otpGenerator.generate(length, {
      digits: digits,
      lowerCaseAlphabets: lowerCase,
      upperCaseAlphabets: upperCase,
      specialChars: specialChars,
    });
  };
  
  async generateOTP(
    length,
    { digits = true, lowerCase = false, upperCase = false, specialChars = false },
  ) {
    return otpGenerator.generate(length, {
      digits: digits,
      lowerCaseAlphabets: lowerCase,
      upperCaseAlphabets: upperCase,
      specialChars: specialChars,
    });
  };

  


  async sentOTPSMS(number, OTP){
    try {

      //let response = await TwoFactor.sendOTP(number, { opt: OTP});
      return true;
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async sentOTPMail(email, OTP) {
    try {

      return true;
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async hmsToSecondsOnly(str = null) {
    if(!str) {
      return 0;
    }
    return str.split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60, i), 0);
  }

  async secondsToHms(seconds) {
    let secondsNum = Number(seconds);
    const h = Math.floor(secondsNum / 3600);
    const m = Math.floor(secondsNum % 3600 / 60);
    const s = Math.floor(secondsNum % 3600 % 60);

    let hDisplay = (h > 0) ? (h < 10) ? "0"+h+":" : h+":" : "00:";
    let mDisplay = (m > 0) ? (m < 10) ? "0"+m+":" : m+":" : "00:";
    let sDisplay = (s > 0) ? (s < 10) ? "0"+s+":" : s+":" : "00";
    return hDisplay + mDisplay + sDisplay; 
  }
}

module.exports = { service };
