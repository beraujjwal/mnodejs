'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { permission } = require('@service/permission.service');
const permissionService = new permission('Permission');
const { baseError } = require('@error/baseError');

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
  async permissionList(req, session) {
      let result = await this.service.getAll(req.query);
      //if all filter fields name are same as db field name you can just use
      //let result = await this.service.getAll (req.query);
      if (result) {
        return {
          code: 200,
          result,
          message: 'Permission list got successfully.'
        }
      }
      throw new baseError('Some error occurred while fetching list of permissions.');
  }

  /**
   * @desc Store a new permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionStore(req, session) {
      let { name } = req.body;
      console.log(req.body);
      //let result = await this.service.permissionStore(name);
      let result = await this.service.permissionStore({ name }, session);
      if (result) {
        return {
          code: 201,
          result,
          message: 'New permission created successfully.'
        }
      }
      throw new baseError('Some error occurred while creating new permission.');
  }

  /**
   * @desc Fetch detail of a permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionDetails(req, session) {
      let permissionId = req.params.id;
      let result = await this.service.get(permissionId);
      if (result) {
        return res
          .status(200)
          .json(
            this.success(result, 'Permission details fetched successfully!'),
          );
      }
      throw new baseError('Some error occurred while fetching permission details.');
  }

  /**
   * @desc Updated a permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionUpdate(req, session) {
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
      throw new baseError('Some error occurred while updating permission details.');
  }

  /**
   * @desc Delete a permission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async permissionDelete(req, session) {
    let permissionId = req.params.id;
    let result = await this.service.permissionDelete(permissionId);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Permission deleted successfully!'));
    }
    throw new baseError('Some error occurred while deleting permission.');
  }
}
module.exports = new permissionsController(permissionService);
