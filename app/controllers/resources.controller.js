'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { resource } = require('@service/resource.service');
const resourceService = new resource('Resource');
const { baseError } = require('@error/baseError');

class resourcesController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
    this.service = resourceService;
    autoBind(this);
  }

  /**
   * @desc Fetching list of resources
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @author Ujjwal Bera
   */
  async resourcesList(req, session) {
    let result = await this.service.resourcesList(req.query, session);
    if (result) {
      return {
        code: 200,
        result,
        message: 'Resources list got successfully.'
      }
    }
    throw new baseError('Some error occurred while fetching list of resources.');
  }

  /**
   * @desc Fetching list of resources
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async resourcesDDLList(req, session) {
    req.query.return_type = 'ddl';
    let result = await this.service.resourcesList(req.query, session);
    if (result) {
      return {
        code: 200,
        result,
        message: 'Resources list for DDL got successfully.'
      }
    }
    throw new baseError('Some error occurred while fetching list of roles.');
  }
  

  /**
   * @desc Store a new resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @author Ujjwal Bera
   */
  async resourceStore(req, session) {
    let { name, parent, rightsAvailable } = req.body;
    let result = await this.service.resourceStore({ name, parent, rightsAvailable }, session);
    if (result) {

      return {
        code: 200,
        result,
        message: 'New resource created successfully.'
      }
    }
    throw new baseError('Some error occurred while creating new resource.');
  }

  /**
   * @desc Fetch detail of a resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @author Ujjwal Bera
   */
  async resourceDetails(req, session) {
    let resourceId = req.params.id;
    console.log(`resourceId=>${resourceId}`)
    let result = await this.service.resourceDetails(resourceId, session);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Resource details got successfully!'));
    }
    throw new baseError('Some error occurred while fetching resource details.');
  }

  /**
   * @desc Updated a resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @author Ujjwal Bera
   */
  async resourceUpdate(req, session) {
    let resourceId = req.params.id;
    let { name, status } = req.body;
    let result = await this.service.resourceUpdate(resourceId, { name, status}, session );
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Resource details updated successfully!'));
    }
    throw new baseError('Some error occurred while updating resource details.');
  }

  /**
   * @desc Updated a resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @author Ujjwal Bera
   */
  async resourceStatusUpdate(req, session) {
    let resourceId = req.params.id;
    let { status } = req.body;
    let result = await this.service.resourceStatusUpdate(resourceId, status, session);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Resource details updated successfully!'));
    }
    throw new baseError('Some error occurred while updating resource details.');
  }

  /**
   * @desc Checking if it a deletable resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @author Ujjwal Bera
   */
  async isDeletableResource(req, session) {
    let resourceId = req.params.id;
    let result = await this.service.isDeletableResource(resourceId, session);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'You can delete this resource!'));
    }
    throw new baseError('Some error occurred while deleting resource.');
  }

  /**
   * @desc Delete a resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @author Ujjwal Bera
   */
  async resourceDelete(req, session) {
    let resourceId = req.params.id;
    let result = await this.service.resourceDelete(resourceId, session);
    if (result) {
      return res
        .status(200)
        .json(this.success(result, 'Resource deleted successfully!'));
    }
    throw new baseError('Some error occurred while deleting resource.');
  }
}
module.exports = new resourcesController(resourceService);
