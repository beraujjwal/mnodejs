const autoBind = require('auto-bind');
const moment = require('moment');
const { service } = require('@service/service');
const { baseError } = require('@error/baseError');
const {
  generatePassword,
  generateOTP,
  generateToken,
} = require('../helpers/utility');

const { sentOTPMail } = require('../../libraries/email.library');
const { sentOTPSMS } = require('../../libraries/sms.library');

class token extends service {
  /**
   * services constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    this.regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    autoBind(this);
  }
  
  async findOtp(userId, otp, type, sentOn) {
    try {
      let cutoff = moment().utc(this.env.APP_TIMEZONE).toDate();
      let tokenCriteria = {
        user: userId,
        token: otp,
        status: true,
        type: type,
        sent_on: sentOn,
        expiresAt: { $gt: cutoff },
      };
      return await this.model.findOne(tokenCriteria);
    } catch (ex) {
      throw new baseError(ex);
    }
  }
  
  async deactiveOtp(Id) {
    try {
      let data = {
        status: false,
        expiresAt:  moment().utc(this.env.APP_TIMEZONE).toDate(),
        token: null,
      };
      let filter = { _id: Id };
      await this.model.updateOne(filter, { $set: data });

    } catch (ex) {
      throw new baseError(ex);
    }
  }
  
  async createToken({userId, type, sentOn}, session) {
    try {
      let isEmail = sentOn.match(this.regexEmail) ? true : false;
      let sentTo = 'phone';

      if(isEmail) {
        sentTo = 'email';
      }

      this.model.updateMany({ user: userId }, { $set: { status: false, expiresAt: moment().utc(this.env.APP_TIMEZONE).toDate() } }).session(session);

      let otpToken = await this.generateOTP(6, {
        digits: true,
      });

      let userToken = await this.model.create([{
        user: userId,
        token: otpToken,
        type: type,
        sent_to: sentTo,
        sent_on: sentOn,
        status: true,
        expiresAt: moment().utc(this.env.APP_TIMEZONE).add(5, 'm').toDate(),
      }], { session: session });
      
      return userToken;
    } catch (ex) {
      console.log(ex);
      throw new baseError(ex);
    }
  }
  
  async findUpdateOrCreate(userId, type, sentOn) {
    try {
      let isEmail = sentOn.match(this.regexEmail) ? true : false;
      let sentTo = 'phone';
      const currentDateTime =  moment().utc(this.env.APP_TIMEZONE).toDate();
      const expiresAt = moment().utc(this.env.APP_TIMEZONE).add(5, 'm').toDate()

      if(isEmail) {
        sentTo = 'email';
      }

      let cutoff = currentDateTime;
      let tokenCriteria = {
        user: userId,
        status: true,
        type: type,
        sent_on: sentOn,
        expiresAt: { $gt: cutoff },
      };
      let otpResponse = await this.model.findOne(tokenCriteria).session(session);

      const otpToken = await this.generateOTP(6, {
        digits: true,
      });

      if(otpResponse) {                
        
        let filter = { _id: otpResponse._id };
        await this.model.updateOne(
          filter, 
          { 
            $set: { 
              token: otpToken, 
              expiresAt: expiresAt 
            } 
          }
        ).session(session);

        otpResponse.token = otpToken;
        otpResponse.expiresAt = expiresAt;
        return otpResponse

      }      

      let userToken = await this.model.create({
        user: userId,
        token: otpToken,
        type: type,
        sent_to: sentTo,
        sent_on: sentOn,
        status: true,
        expiresAt: expiresAt,
      }, { session: session });
      
      return userToken;
    } catch (ex) {
      throw new baseError(ex);
    }
  }
  
}

module.exports = { token };