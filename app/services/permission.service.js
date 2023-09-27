const autoBind = require('auto-bind');
const { service } = require('@service/service');
const { baseError } = require('@error/baseError');

const permissionGraph = require('../../neo4j/services/permission');

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
      let { orderby, order, limit, page, ...search } = queries;
      let filter = { deleted: false };
      if (search.name != null && search.name.length > 0) {
        filter = { ...filter, name: new RegExp(search.name, 'i') };
      }

      return await this.getAll(queries, filter);
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async permissionStore( { name, status = true }, session) {
    try {
      console.log(name);
      const permission = await this.insert({
        name,
        status,
      }, session);

      await permissionGraph.create(permission[0]);
      return permission;
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async permissionDetails(permissionId) {
    try {
      let permission = await this.get(permissionId, { deleted: false });
      if (!permission) {
        throw new baseError('Permission not found with this given details.');
      }
      return permission;
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async permissionUpdate(permissionId, name, status) {
    try {
      await this.updateById(permissionId, {
        name: name,
        status: status,
      }, { deleted: false });
      return await this.get(permissionId);
    } catch (ex) {
      console.log(ex);
      throw new baseError(ex);
    }
  }

  async permissionDelete(permissionId) {
    try {
      return await this.delete({ _id: permissionId });
    } catch (ex) {
      throw new baseError(ex);
    }
  }
}

module.exports = { permission };
