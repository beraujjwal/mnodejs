'use strict';
const autoBind = require('auto-bind');
const { base } = require('../base');

class baseController extends base {
  /**
   * Base Controller Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super();
    this.service = service;
    autoBind(this);
  }

  async getAll(req, res, next) {
    try {
      const response = await this.service.getAll(req.query);

      return res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    const { id } = req.params;

    try {
      const response = await this.service.get(id);

      return res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async insert(req, res, next) {
    try {
      const response = await this.service.insert(req.body);

      return res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;

    try {
      const response = await this.service.update(id, req.body);

      return res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const response = await this.service.delete(id);

      return res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = { baseController };
