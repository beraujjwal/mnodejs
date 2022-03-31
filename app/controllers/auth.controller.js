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
    this.AuthService = new auth();
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
      let result = await this.AuthService.singup({
        name,
        email,
        phone,
        password,
        roles,
      });
      this.ApiRes.successResponseWithData(
        res,
        result,
        'User created successfully!',
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
      let result = await this.AuthService.verify(user_id, token);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User acctivated successfully!',
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
      let result = await this.AuthService.singin(req.body, res);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User login successfully!',
        );
      } else {
        this.ApiRes.successResponse(res, 'Some error occurred while login');
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while login.',
        400,
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
      let result = await this.AuthService.forgotPassword({ username });
      this.ApiRes.successResponseWithData(
        res,
        result,
        'Forgot password mail sent successfully!',
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
      let result = await this.AuthService.verify(user_id, token);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User acctivated successfully!',
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
