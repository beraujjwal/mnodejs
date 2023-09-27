const autoBind = require('auto-bind');
const { service } = require('@service/service');
const { baseError } = require('@error/baseError');

const resourceGraph = require('../../neo4j/services/resource');

class resource extends service {
  /**
   * @description resource service constructor
   * @param null
   * @author Ujjwal Bera
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    this.permission = this.db['Permission'];
    autoBind(this);
  }

  /**
   * @description Fetching list of resources by given query params
   * @param {object} queries 
   * @returns object
   * @author Ujjwal Bera
   */
  async resourcesList(queries) {
    try {
      const {
        name = null,
        parent = null,
        orderby = 'name',
        ordering = 'asc',
        limit = this.dataPerPage,
        page = 1,
        return_type = null,
      } = queries;

      let order = 1;
      if (ordering == 'desc') order = -1;
      const skip = parseInt(page) * parseInt(limit) - parseInt(limit);

      let filter = { deleted: false, parent: parent };
      if(name) filter = { ...filter, name: new RegExp(name, 'i') };

      let unset = ["__v", "childrens.level"];
      let restrictSearchWithMatch = { deleted: false }
      if(return_type === 'ddl') {
        restrictSearchWithMatch = { deleted: false, status: true }
        unset = [
          "__v", "slug", "deleted", "createdAt", "updatedAt", "status", "childrens.__v", "childrens.slug",
          "childrens.deleted", "childrens.status", "childrens.createdAt", "childrens.updatedAt", "childrens.level"
        ];
      }

      const result = await this.model.aggregate([
        {
          $match: filter
        },
        {
          $graphLookup: {
            from: "resources",
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

      
      let response = result[0];
      //response.items = await this.modifyIds(result[0].items);

      const docs = response.items;
      let finalResult = []     //For Storing all parent with childs
      if (docs.length >= 0) {   
          docs.map( async singleDoc => {  //For getting all parent Tree
            const singleChild = await this.listToTree(singleDoc.childrens);
            singleDoc.childrens = singleChild;
            finalResult.push(singleDoc)
          })
      }
      response.items = finalResult;

      return response;
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while fetching resources list. Please try again.',
        ex.status
      );
    }
  }

  /**
   * @description Storing a new resource with given data source
   * @param {object} object
   * @returns object
   * @author Ujjwal Bera
   */
  async resourceStore( { name, parent, rightsAvailable,  status = true }, session ) {
    try {
      
      let rightsAvailableSlugs = [];
      let dbPermissions = null;
      if(rightsAvailable?.length > 0) {
        const permissionSlugs = await this.removeDuplicates(rightsAvailable);
        dbPermissions = await this.permission.find({ slug: { $in: permissionSlugs } });
        rightsAvailableSlugs = await dbPermissions.map((permission) => permission.slug)
      }

      const resource = await this.model.create([{
        name,
        parent,
        rightsAvailable: rightsAvailableSlugs,
        status,
      }], session);

      const result = resource[0];

      //resource[0].rightsAvailable = rightsAvailable;
      
      await resourceGraph.create(resource[0]);
      return result;
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while storing a new resource.',
        ex.status
      );
    }
  }

  /**
   * @description Fatching a resource details identified by the given resource ID.
   * @param {String} resourceId 
   * @returns object
   * @author Ujjwal Bera
   */
  async resourceDetails(resourceId) {
    try {
      let resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) throw new baseError('You have selected an invalid resource.');
      return resource;
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while fetching a resource details.',
        ex.status
      );
    }
  }

  /**
   * @description Updating a resource details identified by the given resource ID.
   * @param {String} resourceId 
   * @param {*} name 
   * @param {*} status 
   * @returns object
   * @author Ujjwal Bera
   */
  async resourceUpdate(resourceId, { name, status }) {
    try {
      let resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) throw new baseError('You have selected an invalid resource.');

      let data = {};

      if (name != null) {
        data.name = name;
      }

      if (status != null) {
        data.status = status;
      }

      let filter = { _id: resourceId };
      await this.model.updateOne(filter, { $set: data });

      return await this.resourceDetails(resourceId);
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while updating a resource details.',
        ex.status
      );
    }
  }

  /**
   * @description Updating a resource status identified by the given resource ID.
   * @param {*} resourceId 
   * @param {*} status 
   * @returns 
   * @author Ujjwal Bera
   */
  async resourceStatusUpdate(resourceId, status) {
    try {
      const resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) throw new baseError('You have selected an invalid resource.');

      if(status) {
        const parentResource = await this.model.findOne({
          _id: resource.parent,
          deleted: false,
        });
        if(parentResource && !parentResource.status) throw new baseError('Please active parent resource before this.');
      } else {
        const childResource = await this.model.findOne({
          parent: resourceId,
          deleted: false,
        });
        if(childResource && childResource.status) throw new baseError('Please in-active child resource before this.');
      }
      
      await this.model.updateOne({ _id: resourceId }, { $set: { status: status } });

      //await this.updateNestedStatus(resourceId, status); 

      return await this.resourceDetails(resourceId);
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while changing a resource status.',
        ex.status
      );
    }
  }

  /**
   * @description Check if a resource is deletable, identified by the given resource ID.
   * @param {*} resourceId 
   * @returns 
   * @author Ujjwal Bera
   */
  async isDeletableResource(resourceId) {
    try {
      let resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) throw new baseError('You have selected an invalid resource.');

      const childResource = await this.model.findOne({
        parent: resourceId,
        deleted: false,
      });

      if (childResource) throw new baseError('You have child resource inside it.');

      return true
      
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while deleting a resource details.',
        ex.status
      );
    }
  }

  /**
   * @description Delete a resource identified by the given resource ID.
   * @param {*} resourceId  - The ID of the resource to be deleted.
   * @returns 
   * @author Ujjwal Bera
   */
  async resourceDelete(resourceId) {
    try {
      let resource = await this.model.findOne({
        _id: resourceId,
        deleted: false,
      });
      if (!resource) throw new baseError('You have selected an invalid resource.');

      await resource.delete();

      return await this.model.findOne({
        _id: resourceId,
        deleted: true,
      });
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while deleting a resource details.',
        ex.status
      );
    }
  }
}

module.exports = { resource };
