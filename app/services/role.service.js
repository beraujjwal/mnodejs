const autoBind = require('auto-bind');
const { service } = require('@service/service');
const { baseError } = require('@error/baseError');
const { validationError } = require('@error/validationError');
const roleGraph = require('../../neo4j/services/role');

class role extends service {
  /**
   * role service constructor
   * @author Ujjwal Bera
   * @param model
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    this.resource = this.db['Resource'];
    autoBind(this);
  }

  async rolesList(queries) {
    try {
      const {
        id = null,
        ids = null,
        name = null,
        parent = null,
        orderby = 'name',
        ordering = 'asc',
        limit = this.dataPerPage,
        page = 1,
        return_type = null,
      } = queries;

      let order = 1;
      if (ordering.toLowerCase() == 'desc') {
        order = -1;
      }
      const skip = parseInt(page) * parseInt(limit) - parseInt(limit);

      let filter = { deleted: false, parent: parent };
      if(name) {
        filter = { ...filter, name: new RegExp(name, 'i') };
      }
      if(id) {
        if(id.length !== 36) filter = { ...filter, _id: new RegExp(id, 'i') };
        else filter = { ...filter, _id: id };
      }
      if(ids) {
        const idsArr = ids.split(',');
        filter = { ...filter, _id: { "$in": idsArr } };
      }

      let unset = ["__v", "childrens.level"];
      let restrictSearchWithMatch = { deleted: false }
      if(return_type === 'ddl') {
        restrictSearchWithMatch = { deleted: false, status: true };
        filter = { ...filter, status: true };
        unset = [
          "__v", "rights", "slug", "deleted", "createdAt", "updatedAt", "status", "childrens.__v", "childrens.slug",
          "childrens.rights", "childrens.deleted", "childrens.status", "childrens.createdAt", "childrens.updatedAt", "childrens.level"
        ];
      }

      const result = await this.model.aggregate([
        {
          $match: filter
        },
        {
          $graphLookup: {
            from: "roles",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parent",
            depthField: "depth",
            maxDepth: 100,
            as: "childrens",
            depthField: "level",
            restrictSearchWithMatch: restrictSearchWithMatch
          },
        },
        {
          $unset: unset
        },
        {
          $sort: { [orderby]: order }
        },
        {
          $facet: {
            items: [
              { $skip: +skip }, { $limit: +limit}
            ],
            total: [
              {
                $count: 'count'
              }
            ]
          }
        }
      ]);

      return result[0];
    } catch (ex) {
      console.log(ex)
      throw new baseError(ex);
    }
  }

  /**
   * @author Ujjwal Bera
   *
   * @param {*} parent
   * @param {*} name
   * @param {*} rights
   * @returns
   */
  async roleStore({ parent, name, description, rights, status = true }, session) {
    try {
      let havError = false, resourceName = null, rightSlugs = [], resourceRightsAvailable = [];
      if (rights != null) {

        for await (const right of rights) {
          if(right.resource === 'root') throw new baseError('You have selected an invalid resource.');

          rightSlugs.push(right.resource);
          const resource = right.resource;
          delete right.resource;
          resourceRightsAvailable[resource] = right;
        }
        let dbResources = await this.resource.find({
          slug: { $in: rightSlugs },
        });
        if (dbResources.length != rights.length) {
          throw new baseError('You have selected an invalid resource.', 412);
        }

        await dbResources.forEach(async(resource) => {
          const selectedResourceRights = resourceRightsAvailable[resource.slug];
          for (const key in selectedResourceRights) {
            if (selectedResourceRights.hasOwnProperty(key)) {
              const rightsAvailable = resource.rightsAvailable;
              if (!rightsAvailable.includes(key)) {
                havError = true;
                resourceName = resource.name;
                break;
              }
            }
          }
        });
      }

      if(havError === true) throw new baseError(`You have selected an invalid right for ${resourceName}.`, 412);

      const role = await this.model.create([{
        parent,
        name,
        description,
        rights,
        status,
      }], { session });

      await roleGraph.create(role[0]);
      return role[0];
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  /**
   * @author Ujjwal Bera
   *
   * @param {*} roleId
   * @returns
   */
  async roleDetails(roleId) {
    try {
      let role = await this.model.findOne({
        _id: roleId,
        deleted: false,
      }).populate();
      if (!role) {
        throw new baseError('Role not found with this given details.');
      }
      return role;
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  /**
   * @description Update role by role ID
   * @author Ujjwal Bera
   *
   * @param {*} roleId
   * @param {*} name
   * @param {*} rights
   * @param {*} status
   * @returns
   */
  async roleUpdate(roleId, parent, name, description, rights, status) {
    try {
      let role = await this.model.findOne({
        _id: roleId,
        deleted: false,
      });
      if (!role) {
        throw new baseError('Role not found.', 404);
      }

      if(role.slug === 'super-admin') {
        throw new baseError('This role is not editable.', 403);
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
          throw new baseError('You have selected an invalid resource.', 400);
        }
      }

      const data = {
        parent: parent,
        name: name,
        status: status,
        rights: rights,
      };

      let filter = { _id: roleId };
      await this.model.updateOne(filter, { $set: data });

      return await this.roleDetails(roleId);
    } catch (ex) {
      throw new baseError(ex.message, ex.status || 500);
    }
  }

  /**
   * @author Ujjwal Bera
   *
   * @param {*} roleId
   * @returns
   */
  async roleCanDelete(roleId) {
    try {
      let role = await this.model.findOne({
        parent: roleId,
        deleted: false,
      });
      if (!role) {
        throw new baseError('Role not found.');
      }

      await role.delete();

      return await this.model.findOne({
        _id: roleId,
        deleted: true,
      });
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  /**
   * @author Ujjwal Bera
   *
   * @param {*} roleId
   * @returns
   */
  async roleDelete(roleId) {
    try {
      const role = await this.model.findOne({
        _id: roleId,
        deleted: false,
      });
      if (!role) {
        throw new baseError('Role not found.');
      }

      //If role have child roles then don't allow delete operation
      const childs = await this.model.find({ parent: roleId, deleted: false });
      if(childs.length > 0) throw new baseError('Some child role belongs to this role. If you still want to delete the role? Then delete those child role belongs to this role or shift them into a different role or make them parent role.', 401);

      //If role have users then don't allow delete operation
      const users = await this.db['User'].find({ roles : { $all : [roleId] }});
      if(users.length > 0) throw new baseError('Some user belongs to this role. If you still want to delete the role? Then delete those user belongs to this role or shift them into a different role.', 401);

      await role.delete();
      return await this.model.findOne({
        _id: roleId,
        deleted: true,
      });
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  /**
   * @author Ujjwal Bera
   *
   * @param {*} roleId
   * @returns
   */
  async checkUserRoleAvailablity( {roles, parentRole, defaultRole = 'admin'}, session ){
    try{
      if (!roles) {
        roles = [defaultRole]; // if role is not selected, setting default role for new user
      }

      let dbRoles = await this.db['Role'].find({ slug: { $in: roles }}).populate({
        path: 'role',
        match: {
          slug: parentRole
        }
      }).session(session).exec();
      if (dbRoles.length !== roles.length) {
        throw new validationError({ roles: ['You have selected an invalid role.']}, 412);
      }
      return dbRoles.map((role) => role._id);
    } catch (ex) {
      console.log('Role service', ex);
      throw new baseError(
        ex || 'An error occurred while creating your account. Please try again.',
        ex.code
      );
    }

  }
}

module.exports = { role };
