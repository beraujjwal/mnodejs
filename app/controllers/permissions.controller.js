'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { permission } = require('@service/permission.service');
const permissionService = new permission('Permission');

class permissionsController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
    this.service = permissionService;
    autoBind(this);
  }

  /**
   * @desc Fetching list of permissions
   * @param {*} req
   * @param {*} res
   */
  async permissionList(req, res) {
    try {
      let result = await this.service.getAll(req.query);
      //if all filter fields name are same as db field name you can just use
      //let result = await this.service.getAll (req.query);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Permission list got successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching list of permissions.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message ||
          'Some error occurred while fetching list of permissions.',
      );
    }
  }

  /**
   * @desc Store a new permission
   * @param {*} req
   * @param {*} res
   */
  async permissionStore(req, res) {
    try {
      let { name } = req.body;
      //let result = await this.service.permissionStore(name);
      let result = await this.service.permissionStore(name);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Permission details stored successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while storing permission.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while storing permission.',
      );
    }
  }

  /**
   * @desc Fetch detail of a permission
   * @param {*} req
   * @param {*} res
   */
  async permissionDetails(req, res) {
    try {
      let permissionId = req.params.id;
      let result = await this.service.get(permissionId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Permission details fetched successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching permission.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching permission.',
      );
    }
  }

  /**
   * @desc Updated a permission
   * @param {*} req
   * @param {*} res
   */
  async permissionUpdate(req, res) {
    try {
      let permissionId = req.params.id;
      let { name, status } = req.body;
      let result = await this.service.permissionUpdate(
        permissionId,
        name,
        status,
      );
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Permission details updated successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while updating permission.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while updating permission.',
      );
    }
  }

  /**
   * @desc Delete a permission
   * @param {*} req
   * @param {*} res
   */
  async permissionDelete(req, res) {
    try {
      let permissionId = req.params.id;
      let result = await this.service.permissionDelete(permissionId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Permission details deleted successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while deleting permission.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while deleting permission.',
      );
    }
  }
}
module.exports = new permissionsController(permissionService);
