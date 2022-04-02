'use strict';
const autoBind = require('auto-bind');
const { base } = require('../base');

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
    autoBind(this);
  }

  async getAll(
    {
      orderby = 'name',
      ordering = 'asc',
      limit = this.dataPerPage,
      page = 1,
      ...search
    },
    filter = null,
  ) {
    try {
      console.log(filter, search);
      if (filter === null) {
        for (const field in search) {
          filter = { ...filter, [field]: new RegExp(search[field], 'i') };
        }
      }
      filter = { ...filter, deleted: false, deletedAt: null };
      let order = 1;
      if (ordering == 'desc') {
        order = -1;
      }
      let skip = parseInt(page) * parseInt(limit) - parseInt(limit);
      const items = await this.model
        .find(filter)
        .sort({ [orderby]: order })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await this.model.countDocuments(filter);
      return { items, totalCount: total };
    } catch (ex) {
      let error = new Error(ex.message);
      error.statusCode = ex.statusCode;
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
      error.statusCode = ex.statusCode;
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
