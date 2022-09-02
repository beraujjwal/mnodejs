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
   * @param {*} next
   */
  async blogList(req, res, next) {
    try {
      let result = await this.service.getAll(req.query);
      //if all filter fields name are same as db field name you can just use
      //let result = await this.service.getAll (req.query);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Blog list got successfully!'));
      }
      next('Some error occurred while fetching list of blogs.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Store a new blog
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async blogStore(req, res, next) {
    try {
      let { name, content } = req.body;
      //let result = await this.service.blogStore(name);
      let result = await this.service.blogStore(name, content);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'New blog created successfully!'));
      }
      next('Some error occurred while creating new blog.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Fetch detail of a blog
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async blogDetails(req, res, next) {
    try {
      let blogId = req.params.id;
      let result = await this.service.get(blogId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Blog details fetched successfully!'));
      }
      next('Some error occurred while fetching blog details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Updated a blog
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async blogUpdate(req, res, next) {
    try {
      let blogId = req.params.id;
      let { name, content, status } = req.body;
      let result = await this.service.blogUpdate(blogId, name, content, status);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Blog details updated successfully!'));
      }
      next('Some error occurred while updating blog details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Delete a blog
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async blogDelete(req, res, next) {
    try {
      let blogId = req.params.id;
      let result = await this.service.blogDelete(blogId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Blog deleted successfully!'));
      }
      next('Some error occurred while deleting blog.');
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new blogsController(blogService);
