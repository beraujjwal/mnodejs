'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { role } = require('@service/role.service');
const roleService = new role('Role');
const { baseError } = require('@error/baseError');

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
  async rolesList(req, session) {
    let result = await this.service.rolesList(req.query, session);
    if (result) {
      return {
        code: 200,
        result,
        message: "ROLES_LIST_FETCH_SUCESSFULLY"
      }
    }
    throw new baseError(__("ROLES_LIST_FETCH_ERROR"));
  }

  /**
   * @desc Fetching list of roles
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async rolesDDLList(req, session) {
    req.query.return_type = 'ddl';
    let result = await this.service.rolesList(req.query, session);
    if (result) {
      return {
        code: 200,
        result,
        message: 'Roles list for DDL got successfully.'
      }
    }
    throw new baseError('Some error occurred while fetching list of roles.');
  }

  /**
   * @desc Store a new role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleStore(req, session) {
    let { parent, name, description, rights } = req.body;
    let result = await this.service.roleStore({ parent, name, description, rights }, session);
    console.log('HERE');
    if (result) {
      return {
        code: 201,
        result,
        message: 'New role created successfully.'
      }
    }
    //throw new baseError('Some error occurred while creating new role.');
  }

  /**
   * @desc Fetch detail of a role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleDetails(req, session) {
    let roleId = req.params.id;
    let result = await this.service.roleDetails(roleId, session);
    if (result) {
      return {
        code: 201,
        result,
        message: 'Role details got successfully.'
      }
    }
    throw new baseError('Some error occurred while fetching role details.');
  }

  /**
   * @desc Updated a role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleUpdate(req, session) {
    let roleId = req.params.id;
    let { parent, name, description, rights, status } = req.body;
    let result = await this.service.roleUpdate(roleId, { parent, name, description, rights, status }, session);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Role details updated successfully!'));
    }
    throw new baseError('Some error occurred while updating role details.');
  }

  /**
   * @desc Delete a role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleCanDelete(req, session) {
    let roleId = req.params.id;
    let result = await this.service.roleCanDelete(roleId, session);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Role can deletable successfully!'));
    }
    throw new baseError('Some error occurred while checking role deletability.');
  }

  /**
   * @desc Delete a role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async roleDelete(req, session) {
    let roleId = req.params.id;
    let result = await this.service.roleDelete(roleId, session);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Role deleted successfully!'));
    }
    throw new baseError('Some error occurred while deleting role.');
  }
}
module.exports = new rolesController(roleService);
