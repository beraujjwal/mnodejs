'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { blog } = require('@service/blog.service');
const blogService = new blog('Blog');

class blogsController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
    this.service = service;
    autoBind(this);
  }

  /**
   * @desc Fetching list of blogs
   * @param {*} req
   * @param {*} res
   */
  async blogList(req, res) {
    try {
      let result = await this.service.getAll(req.query);
      //if all filter fields name are same as db field name you can just use
      //let result = await this.service.getAll (req.query);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Blog list got successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching list of blogs.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching list of blogs.',
      );
    }
  }

  /**
   * @desc Store a new blog
   * @param {*} req
   * @param {*} res
   */
  async blogStore(req, res) {
    try {
      let { name, content } = req.body;
      //let result = await this.service.blogStore(name);
      let result = await this.service.blogStore(name, content);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Blog details stored successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while storing blog.',
        );
      }
    } catch (err) {
      console.log(err);
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while storing blog.',
      );
    }
  }

  /**
   * @desc Fetch detail of a blog
   * @param {*} req
   * @param {*} res
   */
  async blogDetails(req, res) {
    try {
      let blogId = req.params.id;
      let result = await this.service.get(blogId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Blog details fetched successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching blog.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching blog.',
      );
    }
  }

  /**
   * @desc Updated a blog
   * @param {*} req
   * @param {*} res
   */
  async blogUpdate(req, res) {
    try {
      let blogId = req.params.id;
      let { name, content, status } = req.body;
      let result = await this.service.blogUpdate(blogId, name, content, status);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Blog details updated successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while updating blog.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while updating blog.',
      );
    }
  }

  /**
   * @desc Delete a blog
   * @param {*} req
   * @param {*} res
   */
  async blogDelete(req, res) {
    try {
      let blogId = req.params.id;
      let result = await this.service.blogDelete(blogId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Blog details deleted successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while deleting blog.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while deleting blog.',
      );
    }
  }
}
module.exports = new blogsController(blogService);
