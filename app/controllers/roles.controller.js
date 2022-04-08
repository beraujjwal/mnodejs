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
   */
  async roleList(req, res) {
    try {
      let result = await this.service.roleList(req.query);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Role list got successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching list of roles.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching list of roles.',
      );
    }
  }

  /**
   * @desc Store a new role
   * @param {*} req
   * @param {*} res
   */
  async roleStore(req, res) {
    try {
      let { name, rights } = req.body;
      let result = await this.service.roleStore(name, rights);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Role details stored successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while storing role.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while storing role.',
      );
    }
  }

  /**
   * @desc Fetch detail of a role
   * @param {*} req
   * @param {*} res
   */
  async roleDetails(req, res) {
    try {
      let roleId = req.params.id;
      let result = await this.service.roleDetails(roleId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Role details fetched successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching role.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching role.',
      );
    }
  }

  /**
   * @desc Updated a role
   * @param {*} req
   * @param {*} res
   */
  async roleUpdate(req, res) {
    try {
      let roleId = req.params.id;
      let { name, rights, status } = req.body;
      let result = await this.service.roleUpdate(roleId, name, rights, status);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Role details updated successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while updating role.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while updating role.',
      );
    }
  }

  /**
   * @desc Delete a role
   * @param {*} req
   * @param {*} res
   */
  async roleDelete(req, res) {
    try {
      let roleId = req.params.id;
      let result = await this.service.roleDelete(roleId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Role details deleted successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while deleting role.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while deleting role.',
      );
    }
  }
}
module.exports = new rolesController(roleService);
