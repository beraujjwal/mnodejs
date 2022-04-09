'use strict';
const autoBind = require('auto-bind');

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
    this.service = service;
    autoBind(this);
  }

  /**
   * @desc create new user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async register(req, res, next) {
    try {
      let { name, email, phone, password, roles } = req.body;
      let result = await this.service.singup({
        name,
        email,
        phone,
        password,
        roles,
      });
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User created successfully!'));
      }
      next(
        'Some error occurred while creating your account. Please try again.',
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc verify new user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async verify(req, res, next) {
    try {
      let { user_id, token } = req.params;
      let result = await this.service.verify(user_id, token);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User acctivated successfully!'));
      }
      next('Some error occurred while verify your account. Please try again.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc user login
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async login(req, res, next) {
    try {
      let result = await this.service.singin(req.body, res);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User login successfully!'));
      }
      next('Some error occurred while login');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc User forgot password
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async forgotPassword(req, res, next) {
    try {
      let { username } = req.body;
      let result = await this.service.forgotPassword({ username });
      if (result) {
        return res
          .status(200)
          .json(
            this.success(result, 'Forgot password mail sent successfully!'),
          );
      }
      next('Some error occurred while login');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc reset user password
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async reset(req, res, next) {
    try {
      let { user_id, token } = req.params;
      let result = await this.service.verify(user_id, token);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User acctivated successfully!'));
      }
      next('Some error occurred while verify your account. Please try again.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc reset user password
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async resetPassword(req, res, next) {
    try {
      let { user_id, token } = req.params;
      let result = await this.service.verify(user_id, token);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User acctivated successfully!'));
      }
      next('Some error occurred while verify your account. Please try again.');
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new authController(userService);
