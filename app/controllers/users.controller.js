'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { auth } = require('@service/auth.service');

class usersController extends controller {
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
  async create(req, res) {
    try {
      let result = await this.Auth.singup(req.body);
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

  async login(req, res) {
    try {
      let result = await this.Auth.singin(req.body);

      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          'User login successfully!',
          result,
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while creating the User.',
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
module.exports = new usersController();
