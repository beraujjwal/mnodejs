'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { resource } = require('@service/resource.service');
const resourceService = new resource('Resource');

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
   */
  async resourceList(req, res, next) {
    try {
      let result = await this.service.resourceList(req.query);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Resource list got successfully!'));
      }
      next('Some error occurred while fetching list of resources.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Store a new resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async resourceStore(req, res, next) {
    try {
      let { name } = req.body;
      let result = await this.service.resourceStore(name);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'New resource created successfully!'));
      }
      next('Some error occurred while creating new resource.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Fetch detail of a resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async resourceDetails(req, res, next) {
    try {
      let resourceId = req.params.id;
      let result = await this.service.resourceDetails(resourceId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Resource details got successfully!'));
      }
      next('Some error occurred while fetching resource details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Updated a resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async resourceUpdate(req, res, next) {
    try {
      let resourceId = req.params.id;
      let { name, status } = req.body;
      let result = await this.service.resourceUpdate(resourceId, name, status);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Resource details updated successfully!'));
      }
      next('Some error occurred while updating resource details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Delete a resource
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async resourceDelete(req, res, next) {
    try {
      let resourceId = req.params.id;
      let result = await this.service.resourceDelete(resourceId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Resource deleted successfully!'));
      }
      next('Some error occurred while deleting resource.');
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new resourcesController(resourceService);
