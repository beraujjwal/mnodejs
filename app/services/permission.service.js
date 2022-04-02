const autoBind = require('auto-bind');
const { service } = require('@service/service');

class permission extends service {
  /**
   * permission service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    autoBind(this);
  }

  async permissionList(queries) {
    try {
      let { orderby, ordering, limit, page, ...search } = queries;
      let filter = { deleted: false };
      if (search.keyword != null && search.keyword.length > 0) {
        filter = { ...filter, name: new RegExp(search.keyword, 'i') };
      }

      return await this.getAll(queries, filter);
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async permissionStore(name) {
    try {
      return await this.insert({
        name: name,
        slug: name.split(' ').join('-').toLowerCase(),
        status: true,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }

  async permissionDetails(permissionId) {
    try {
      let permission = await this.get(permissionId);
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
      await this.updateById(permissionId, {
        name: name,
        status: status,
      });
      return await this.get(permissionId);
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }

  async permissionDelete(permissionId) {
    try {
      return await this.delete({ _id: permissionId });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }
}

module.exports = { permission };
