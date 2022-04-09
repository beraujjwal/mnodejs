'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { role } = require('@service/role.service');
const roleService = new role('Role');

class rolesController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
    this.service = roleService;
    autoBind(this);
  }

  /**
   * @desc Fetching list of roles
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleList(req, res, next) {
    try {
      let result = await this.service.roleList(req.query);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Role list got successfully!'));
      }
      next('Some error occurred while fetching list of roles.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Store a new role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleStore(req, res, next) {
    try {
      let { name, rights } = req.body;
      let result = await this.service.roleStore(name, rights);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'New role created successfully!'));
      }
      next('Some error occurred while creating new role.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Fetch detail of a role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleDetails(req, res, next) {
    try {
      let roleId = req.params.id;
      let result = await this.service.roleDetails(roleId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Role details got successfully!'));
      }
      next('Some error occurred while fetching role details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Updated a role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleUpdate(req, res, next) {
    try {
      let roleId = req.params.id;
      let { name, rights, status } = req.body;
      let result = await this.service.roleUpdate(roleId, name, rights, status);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Role details updated successfully!'));
      }
      next('Some error occurred while updating role details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Delete a role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleDelete(req, res, next) {
    try {
      let roleId = req.params.id;
      let result = await this.service.roleDelete(roleId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Role deleted successfully!'));
      }
      next('Some error occurred while deleting role.');
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new rolesController(roleService);
