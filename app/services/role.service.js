const autoBind = require('auto-bind');
const { service } = require('@service/service');

class role extends service {
  /**
   * role service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    this.resource = this.db['Resource'];
    autoBind(this);
  }

  async roleList(queries) {
    try {
      let { orderby, order, limit, page, ...search } = queries;
      let filter = { deleted: false };
      if (search.name != null && search.name.length > 0) {
        filter = { ...filter, name: new RegExp(search.name, 'i') };
      }

      return await this.getAll(queries, filter);
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async roleStore(name, rights) {
    try {
      if (rights != null) {
        let rightSlugs = [];
        for await (const right of rights) {
          rightSlugs.push(right.resource);
        }
        let dbResources = await this.resource.find({
          slug: { $in: rightSlugs },
        });
        if (dbResources.length != rights.length) {
          throw new Error('You have selected an invalid right.');
        }
      }

      const role = new this.model({
        name: name,
        slug: name.split(' ').join('-').toLowerCase(),
        rights: rights,
        status: true,
      });
      return role.save(role);
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async roleDetails(roleId) {
    try {
      let role = await this.model.findOne({
        _id: roleId,
        deleted: false,
      });
      if (!role) {
        throw new Error('Role not found with this given details.');
      }
      return role;
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async roleUpdate(roleId, name, rights, status) {
    try {
      let role = await this.model.findOne({
        _id: roleId,
        deleted: false,
      });
      if (!role) {
        throw new Error('Role not found.');
      }

      if (rights != null) {
        let rightSlugs = [];
        for await (const right of rights) {
          rightSlugs.push(right.resource);
        }
        let dbResources = await this.resource.find({
          slug: { $in: rightSlugs },
        });
        if (dbResources.length != rights.length) {
          throw new Error('You have selected an invalid role.');
        }
      }

      let data = role._doc;

      if (name != null) {
        data.name = name;
      }

      if (rights != null) {
        data.rights = rights;
      }

      if (status != null) {
        data.status = status;
      }

      // Removing below data from main object
      delete data.__v;
      delete data._id;
      delete data.updatedAt;
      delete data.createdAt;

      let filter = { _id: roleId };
      await this.model.updateOne(filter, { $set: data });

      return await this.model.findOne({
        _id: roleId,
        deleted: false,
      });
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async roleDelete(roleId) {
    try {
      let role = await this.model.findOne({
        _id: roleId,
        deleted: false,
      });
      if (!role) {
        throw new Error('Role not found.');
      }

      await role.delete();

      return await this.model.findOne({
        _id: roleId,
        deleted: true,
      });
    } catch (ex) {
      throw new Error(ex.message);
    }
  }
}

module.exports = { role };
