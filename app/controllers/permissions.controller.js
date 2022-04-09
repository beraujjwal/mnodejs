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
   * @param {*} next
   */
  async permissionList(req, res, next) {
    try {
      let result = await this.service.getAll(req.query);
      //if all filter fields name are same as db field name you can just use
      //let result = await this.service.getAll (req.query);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Permission list got successfully!'));
      }

      next('Some error occurred while fetching list of permissions.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Store a new permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionStore(req, res, next) {
    try {
      let { name } = req.body;
      //let result = await this.service.permissionStore(name);
      let result = await this.service.permissionStore(name);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'New permission created successfully!'));
      }
      next('Some error occurred while creating new permission.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Fetch detail of a permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionDetails(req, res, next) {
    try {
      let permissionId = req.params.id;
      let result = await this.service.get(permissionId);
      if (result) {
        return res
          .status(200)
          .json(
            this.success(result, 'Permission details fetched successfully!'),
          );
      }
      next('Some error occurred while fetching permission details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Updated a permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionUpdate(req, res, next) {
    try {
      let permissionId = req.params.id;
      let { name, status } = req.body;
      let result = await this.service.permissionUpdate(
        permissionId,
        name,
        status,
      );
      if (result) {
        return res
          .status(200)
          .json(
            this.success(result, 'Permission details updated successfully!'),
          );
      }
      next('Some error occurred while updating permission details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Delete a permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionDelete(req, res, next) {
    try {
      let permissionId = req.params.id;
      let result = await this.service.permissionDelete(permissionId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Permission deleted successfully!'));
      }
      next('Some error occurred while deleting permission.');
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new permissionsController(permissionService);
