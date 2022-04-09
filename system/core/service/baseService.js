'use strict';
const autoBind = require('auto-bind');
const { parseInt } = require('lodash');
const { base } = require('../base');

const { log, error, info } = require('../helpers/errorLogs');

class baseService extends base {
  /**
   * Base Service Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super();
    this.name = model;
    this.model = this.db[model];
    this.dataPerPage = this.env.DATA_PER_PAGE;
    this.log = log;
    this.errorLog = error;
    this.infoLog = info;
    autoBind(this);
  }

  async getAll(
    {
      orderby = 'name',
      order = 'asc',
      limit = this.dataPerPage,
      page = 1,
      ...search
    },
    filter = null,
  ) {
    try {
      if (filter === null) {
        for (const field in search) {
          let filterValue;
          if (typeof search[field] === 'number') {
            filterValue = parseInt(search[field]);
          } else if (typeof search[field] === 'string') {
            filterValue = new RegExp(search[field], 'i');
          } else if (typeof search[field] === 'boolean') {
            filterValue = parseInt(search[field]);
          } else {
            filterValue = search[field];
          }
          filter = { ...filter, [field]: filterValue };
        }
      }
      filter = { ...filter, deleted: false, deletedAt: null };
      let ordering = 1;
      if (order == 'desc') {
        ordering = -1;
      }
      let skip = parseInt(page) * parseInt(limit) - parseInt(limit);
      const items = await this.model
        .find(filter)
        .sort({ [orderby]: ordering })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await this.model.countDocuments(filter);
      return { items, totalCount: total };
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = 400;
      throw error;
    }
  }

  async get(id) {
    try {
      const item = await this.model.findById(id);
      if (item) {
        return item;
      }
      throw new Error(`This ${this.name} not found.`);
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = 400;
      throw error;
    }
  }

  async insert(data) {
    try {
      Object.keys(data).forEach(
        (key) => data[key] === undefined && delete data[key],
      );
      const item = await this.model.create(data);

      if (item) {
        return item;
      }
      throw new Error(`Unable to create this ${this.name}.`);
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = ex.statusCode;
      throw error;
    }
  }

  async updateById(id, data) {
    try {
      Object.keys(data).forEach(
        (key) => data[key] === undefined && delete data[key],
      );

      const item = await this.model.findByIdAndUpdate(id, data, { new: true });

      if (item) {
        return item;
      }
      throw new Error(`Unable to update this ${this.name}.`);
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = ex.statusCode;
      throw error;
    }
  }

  async update(filter, data) {
    try {
      Object.keys(data).forEach(
        (key) => data[key] === undefined && delete data[key],
      );
      const item = await this.model.findByIdAndUpdate(filter, data, {
        new: true,
      });

      if (item) {
        return item;
      }
      throw new Error(`Unable to update this ${this.name}.`);
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = ex.statusCode;
      throw error;
    }
  }

  async deleteById(id) {
    try {
      let data = { deleted: true, deletedAt: new Date() };
      const item = await this.model.findByIdAndUpdate(id, data, { new: true });

      if (item) {
        return item;
      }
      throw new Error(`Unable to update this ${this.name}.`);
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = ex.statusCode;
      throw error;
    }
  }

  async delete(filter) {
    try {
      let data = { deleted: true, deletedAt: new Date() };
      const item = await this.model.findByIdAndUpdate(filter, data, {
        new: true,
      });

      if (item) {
        return item;
      }
      throw new Error('Something wrong happened');
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = ex.statusCode;
      throw error;
    }
  }
}

module.exports = { baseService };
