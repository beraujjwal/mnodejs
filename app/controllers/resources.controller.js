'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { resource } = require('@service/resource.service');

class resourcesController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.resourceService = new resource();
    autoBind(this);
  }

  /**
   * @desc Fetching list of resources
   * @param {*} req
   * @param {*} res
   */
  async resourceList(req, res) {
    try {
      let result = await this.resourceService.resourceList(req.query);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Resource list got successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching list of resources.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching list of resources.',
      );
    }
  }

  /**
   * @desc Store a new resource
   * @param {*} req
   * @param {*} res
   */
  async resourceStore(req, res) {
    try {
      let { name } = req.body;
      let result = await this.resourceService.resourceStore(name);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Resource details stored successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while storing resource.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while storing resource.',
      );
    }
  }

  /**
   * @desc Fetch detail of a resource
   * @param {*} req
   * @param {*} res
   */
  async resourceDetails(req, res) {
    try {
      let resourceId = req.params.id;
      let result = await this.resourceService.resourceDetails(resourceId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Resource details fetched successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching resource.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching resource.',
      );
    }
  }

  /**
   * @desc Updated a resource
   * @param {*} req
   * @param {*} res
   */
  async resourceUpdate(req, res) {
    try {
      let resourceId = req.params.id;
      let { name, status } = req.body;
      let result = await this.resourceService.resourceUpdate(
        resourceId,
        name,
        status,
      );
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Resource details updated successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while updating resource.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while updating resource.',
      );
    }
  }

  /**
   * @desc Delete a resource
   * @param {*} req
   * @param {*} res
   */
  async resourceDelete(req, res) {
    try {
      let resourceId = req.params.id;
      let result = await this.resourceService.resourceDelete(resourceId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Resource details deleted successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while deleting resource.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while deleting resource.',
      );
    }
  }
}
module.exports = new resourcesController();
