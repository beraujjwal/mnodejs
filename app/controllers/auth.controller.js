'use strict';
const autoBind = require('auto-bind');
const { baseError } = require('@error/baseError');
const { controller } = require('./controller');
const { user } = require('@service/user.service');

const userService = new user('User');

class authController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
  }
  

  /**
   * @desc create new user
   * @param {*} req
   */
  async register(req, session) {
      let { name, email, phone, password, roles } = req.body;      
      let result = await userService.singup( {name, email, phone, password, roles}, session );
      if (result) {
        return {
          code: 201,
          result,
          message: 'User created successfully!'
        }
      }
      throw new baseError(
        'Some error occurred while creating your account. Please try again.',
        500
      );
  }

  /**
   * @desc verify new user
   * @param {*} req
   */
  async verify(req, session) {
      let { token, username } = req.body;
      let result = await userService.verify(username, token);
      if (result) {
        return {
          code: 200,
          result,
          message: 'User acctivated successfully!'
        }
      }
      throw new baseError(
        'Some error occurred while verify your account. Please try again.',
        500
      );
  }

  /**
   * @desc user login
   * @param {*} req
   */
  async login(req, session) {
      let message = 'Please compleate your signup process!';
      let { device_id, device_type, fcm_token, username, password } = req.body;
      let result = await userService.login(
        { username, password },
        { device_id, device_type, fcm_token }
      );
      
      if(result.accessToken) {
        message = __('LOGIN_SUCCESS');  
      } else if (result.user?.isCompleted) {
        message = 'Login token generated successfully!';
      }

      console.log(message);
      
      return {
        code: 200,
        result,
        message
      }
  }

  /**
   * @desc user login with otp
   * @param {*} req
   */
  async otpVerify(req, session) {
      let message = 'Please compleate your signup process!';
      let { device_id, device_type, fcm_token, username, otp } = req.body;
      let result = await userService.otpVerify(
        { username, otp },
        { device_id, device_type, fcm_token }
      );
      if (result) {
        if(result.user.isCompleted) {
          message = 'User login successfully!'
        }
        return {
          code: 200,
          result,
          message
        }
      }
      throw new baseError(
        'Some error occurred while login',
        500
      );
  }

  /**
   * @desc Resend verify otp
   * @param {*} req
   */
  async otpResend(req, session) {
      let message = 'OTP sent successfully!';
      let { username, type } = req.body;
      let result = await userService.otpResend( username, type );
      if (result) {
        return {
          code: 200,
          result,
          message
        }
      }
      
      throw new baseError(
        'Some error occurred while resending verify OTP.',
        500
      );
  }

  /**
   * @desc Resend verify otp
   * @param {*} req
   */
  async phoneVerify(req, session) {
      let message = 'Your phone number verified successfully!';
      let { phone, otp } = req.body;
      let result = await userService.phoneVerify( phone, otp );
      if (result) {
        return {
          code: 200,
          result,
          message
        }
      }
      
      throw new baseError(
        'Some error occurred while verifying your phone number.',
        500
      );
  }

  /**
   * @desc Resend verify otp
   * @param {*} req
   */
  async emailVerify(req, session) {
      let message = 'Your email address verified successfully!';
      let { email, otp } = req.body;
      let result = await userService.emailVerify( email, otp );
      if (result) {
        return {
          code: 200,
          result,
          message
        }
      }
      
      throw new baseError(
        'Some error occurred while verifying your email address.',
        500
      );
  }

  /**
   * @desc User forgot password
   * @param {*} req
   */
  async forgotPassword(req, session) {
      let { username } = req.body;
      let result = await userService.forgotPassword({ username });
      if (result) {
        return {
          code: 200,
          result,
          message: 'Forgot password mail sent successfully!'
        }
      }
      
      throw new baseError(
        'Some error occurred while login',
        500
      );
  }

  /**
   * @desc reset user password
   * @param {*} req
   */
  async reset(req, session) {
      let { user_id, token } = req.params;
      let result = await userService.verify(user_id, token);
      if (result) {
        return {
          code: 200,
          result,
          message: 'User acctivated successfully!'
        }
      }
      
      throw new baseError(
        'Some error occurred while verify your account. Please try again.',
        500
      );
  }

  /**
   * @desc reset user password
   * @param {*} req
   */
  async resetPassword(req, session) {
      let { username, otp, password } = req.body;
      let result = await userService.resetPassword( { username, otp, password } );
      if (result) {
        return {
          code: 200,
          result,
          message: 'User pasword reset successfully!'
        }
      }
      
      throw new baseError(
        'Some error occurred while verify your account. Please try again.',
        500
      );
  }

  /**
   * @desc reset user password
   * @param {*} req
   */
  async samplePage(req, session) {
      let { email } = req.query;
      let result = await userService.getUserDetailsByUsername(email);
      if (result) {
        return {
          code: 200,
          result,
          message: 'User acctivated successfully!'
        }
      }
      
      throw new baseError(
        'Some error occurred while verify your account. Please try again.',
        500
      );
  }

  /**
   * @desc reset user password
   * @param {*} req
   */
  async samplePagePost(req, session) {
      let { page } = req.query;
      let result = await userService.getUserDetailsByUsername('administrator@mail.com');
      if (result) {
        return {
          code: 200,
          result,
          message: 'Sample Page response send successfully!'
        }
      }
      
      throw new baseError(
        'Some error occurred while verify your account. Please try again.',
        500
      );
  }
}
module.exports = new authController(userService);