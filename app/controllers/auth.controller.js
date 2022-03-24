'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { auth } = require('@service/auth.service');

class authController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.Auth = new auth();
    autoBind(this);
  }

  /**
   * @desc create new user
   * @param {*} req
   * @param {*} res
   */
  async register(req, res) {
    try {
      let { name, email, phone, password, roles } = req.body;
      let result = await this.Auth.singup({
        name,
        email,
        phone,
        password,
        roles,
      });
      this.ApiRes.successResponseWithData(
        res,
        'User created successfully!',
        result,
      );
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while creating the User.',
      );
    }
  }

  /**
   * @desc verify new user
   * @param {*} req
   * @param {*} res
   */
  async verify(req, res) {
    try {
      let { user_id, token } = req.params;
      let result = await this.Auth.verify(user_id, token);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          'User acctivated successfully!',
          result,
        );
      } else {
        this.ApiRes.errorResponse(
          res,
          'Some error occurred while verify your account. Please try again.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while creating the User.',
      );
    }
  }

  /**
   * @desc user login
   * @param {*} req
   * @param {*} res
   */
  async login(req, res) {
    try {
      let result = await this.Auth.singin(req.body, res);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          'User login successfully!',
          result,
        );
      } else {
        this.ApiRes.successResponse(res, 'Some error occurred while login');
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while login.',
      );
    }
  }

  /**
   * @desc User forgot password
   * @param {*} req
   * @param {*} res
   */
  async forgotPassword(req, res) {
    try {
      let { username } = req.body;
      let result = await this.Auth.forgotPassword({ username });
      this.ApiRes.successResponseWithData(
        res,
        'Forgot password mail sent successfully!',
        result,
      );
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while creating the User.',
      );
    }
  }

  /**
   * @desc reset user password
   * @param {*} req
   * @param {*} res
   */
  async reset(req, res) {
    try {
      let { user_id, token } = req.params;
      let result = await this.Auth.verify(user_id, token);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          'User acctivated successfully!',
          result,
        );
      } else {
        this.ApiRes.errorResponse(
          res,
          'Some error occurred while verify your account. Please try again.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while creating the User.',
      );
    }
  }
}
module.exports = new authController();
