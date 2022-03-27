const autoBind = require('auto-bind');
const { service } = require('@service/service');

class resource extends service {
  /**
   * resource service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.Resource = this.db.Resource;
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

      return await this.Resource.find(filter)
        .sort({ [orderby]: order })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async resourceStore(name) {
    try {
      const resource = new this.Resource({
        name: name,
        slug: name.split(' ').join('-').toLowerCase(),
      });
      return resource.save(resource);
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async resourceDetails(resourceId) {
    try {
      let resource = await this.Resource.findOne({
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

  async resourceUpdate(resourceId, name) {
    try {
      let resource = await this.Resource.findOne({
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

      // Removing below data from main object
      delete data.__v;
      delete data._id;
      delete data.updatedAt;
      delete data.createdAt;

      let filter = { _id: resourceId };
      await this.Resource.updateOne(filter, { $set: data });

      return await this.Resource.findOne({
        _id: resourceId,
        deleted: false,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }

  async resourceDelete(resourceId) {
    try {
      let resource = await this.Resource.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) {
        throw new Error('Resource not found.');
      }

      await resource.delete();

      return await this.Resource.findOne({
        _id: resourceId,
        deleted: true,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }
}

module.exports = { resource };
