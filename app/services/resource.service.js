const autoBind = require('auto-bind');
const { service } = require('@service/service');

class resource extends service {
  /**
   * resource service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    autoBind(this);
  }

  async resourceList(queries) {
    try {
      let {
        keyword = null,
        orderby = 'name',
        ordering = 'asc',
        limit = 10,
        skip = 0,
      } = queries;
      let filter = { deleted: false };
      if (keyword != null && keyword.length > 0) {
        filter = { ...filter, name: new RegExp(keyword, 'i') };
      }
      let order = 1;
      if (ordering == 'desc') {
        order = -1;
      }

      return await this.model
        .find(filter)
        .sort({ [orderby]: order })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async resourceStore(name) {
    try {
      const resource = new this.model({
        name: name,
        slug: name.split(' ').join('-').toLowerCase(),
        status: true,
      });
      return resource.save(resource);
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async resourceDetails(resourceId) {
    try {
      let resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) {
        throw new Error('Resource not found with this given details.');
      }
      return resource;
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async resourceUpdate(resourceId, name, status) {
    try {
      let resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) {
        throw new Error('Resource not found.');
      }

      let data = resource._doc;

      if (name != null) {
        data.name = name;
      }

      if (status != null) {
        data.status = status;
      }

      // Removing below data from main object
      delete data.__v;
      delete data._id;
      delete data.updatedAt;
      delete data.createdAt;

      let filter = { _id: resourceId };
      await this.model.updateOne(filter, { $set: data });

      return await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async resourceDelete(resourceId) {
    try {
      let resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) {
        throw new Error('Resource not found.');
      }

      await resource.delete();

      return await this.model.findOne({
        _id: resourceId,
        deleted: true,
      });
    } catch (ex) {
      throw new Error(ex.message);
    }
  }
}

module.exports = { resource };
