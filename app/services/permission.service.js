const autoBind = require('auto-bind');
const { service } = require('@service/service');

class permission extends service {
  /**
   * permission service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.Permission = this.db.Permission;
    autoBind(this);
  }

  async permissionList(queries) {
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
      return await this.Permission.find(filter)
        .sort({ [orderby]: order })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async permissionStore(name) {
    try {
      const permission = new this.Permission({
        name: name,
        slug: name.split(' ').join('-').toLowerCase(),
        status: true,
      });
      return permission.save(permission);
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async permissionDetails(permissionId) {
    try {
      let permission = await this.Permission.findOne({
        _id: permissionId,
        deleted: false,
      });
      if (!permission) {
        throw new Error('Permission not found with this given details.');
      }
      return permission;
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async permissionUpdate(permissionId, name, status) {
    try {
      let permission = await this.Permission.findOne({
        _id: permissionId,
        deleted: false,
      });
      if (!permission) {
        throw new Error('Permission not found.');
      }

      let data = permission._doc;

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

      let filter = { _id: permission._id };
      await this.Permission.updateOne(filter, { $set: data });

      return await this.Permission.findOne({
        _id: permissionId,
        deleted: false,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }

  async permissionDelete(permissionId) {
    try {
      let permission = await this.Permission.findOne({
        _id: permissionId,
        deleted: false,
      });
      if (!permission) {
        throw new Error('Permission not found.');
      }

      await permission.delete();

      return await this.Permission.findOne({
        _id: permissionId,
        deleted: true,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }
}

module.exports = { permission };
