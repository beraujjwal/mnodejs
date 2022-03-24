'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { user } = require('@service/user.service');

class usersController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.UserService = new user();
    autoBind(this);
  }

  /**
   * @desc get logged-in user profile
   * @param {*} req
   * @param {*} res
   */
  async profile(req, res) {
    try {
      console.log(req.user);
      let result = await this.UserService.getProfile(req.user.id);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          'Profile details got successfully!',
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
   * @desc get logged-in user profile
   * @param {*} req
   * @param {*} res
   */
  async updateProfile(req, res) {
    try {
      let result = await this.UserService.updateProfile(req.user.id, req.body);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          'Profile details updated successfully!',
          result,
        );
      } else {
        this.ApiRes.successResponse(res, 'Some error occurred while login');
      }
    } catch (err) {
      console.log(err);
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while login.',
      );
    }
  }
}
module.exports = new usersController();
