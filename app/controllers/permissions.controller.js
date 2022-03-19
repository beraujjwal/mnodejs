'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { permission } = require('@service/permission.service');

class permissionsController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.permissionService = new permission();
    autoBind(this);
  }

  /**
   * @desc get logged-in user profile
   * @param {*} req
   * @param {*} res
   */
  async permissionList(req, res) {
    try {
      console.log(req.user);
      let result = await this.permissionService.permissionList(req.user.id);
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
  async permissionStore(req, res) {
    try {
      console.log(req.user);
      let result = await this.permissionService.permissionStore(req.body);
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
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while login.',
      );
    }
  }
}
module.exports = new permissionsController();
