'use strict';
const autoBind = require('auto-bind');
const { base } = require('../base');

const { baseError } = require('@error/baseError');

class baseController extends base {
  /**
   * Base Controller Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super();
    this.service = service;
    
    autoBind(this);
  }

  async getAll(req, session) {
      const response = await this.service.getAll(req.query, session);
      if (response) {
        return {
          code: 200,
          result: response,
          message: 'Items was fetched successfully.'
        }
      }
      throw new baseError('Some error occurred while fetching items list.');
  }

  async getById(req, session) {
    const { id } = req.params;
    const response = await this.service.getById(id, session);
    if (response) {
      return {
        code: 200,
        result: response,
        message: 'Item details was fetched successfully.'
      }
    }
    throw new baseError('Some error occurred while fetching item details.');
  }

  async get(req, session) {
    const response = await this.service.get(req.params, session);
    if (response) {
      return {
        code: 200,
        result: response,
        message: 'Item details was fetched successfully.'
      }
    }
    throw new baseError('Some error occurred while fetching item details.');
  }

  async insertMany(req, session) {
    const response = await this.service.insertMany(req.body, session);
    if(response) {
      return {
        code: 200,
        result: response,
        message: 'New items was added successfully.'
      }
    }
    throw new baseError('Some error occurred while adding new items.');
  }

  async insert(req, session) {
    const response = await this.service.insert(req.body, session);
    if(response) {
      return {
        code: 200,
        result: response,
        message: 'The new item was added successfully.'
      }
    }
    throw new baseError('Some error occurred while adding the new item.');
  }

  async updateById(req, session) {
    const { id } = req.params;
    const response = await this.service.updateById(id, req.body, session);

    if(response) {
      return {
        code: 200,
        result: response,
        message: 'The item was updated successfully.'
      }
    }
    throw new baseError('Some error occurred while updating the item.');
  }

  async update(req, session) {
    const response = await this.service.update(req.params, req.body, session);

    if(response) {
      return {
        code: 200,
        result: response,
        message: 'The item was updated successfully.'
      }
    }
    throw new baseError('Some error occurred while updating the item.');
  }

  async updateMany(req, session) {
    const response = await this.service.updateMany(req.params, req.body, session);

    if(response) {
      return {
        code: 200,
        result: response,
        message: 'Items was updated successfully.'
      }
    }
    throw new baseError('Some error occurred while updating the items.');
  }

  async deleteById(req, session) {
    const { id } = req.params;
    const response = await this.service.deleteById(id, session);
    if(response) {
      return {
        code: 200,
        result: response,
        message: 'The item Deleted successfully.'
      }
    }
    throw new baseError('Some error occurred while deleting the item.');    
  }

  async delete(req, session) {
    const response = await this.service.delete(req.params, session);
    if(response) {
      return {
        code: 200,
        result: response,
        message: 'The item was Deleted successfully.'
      }
    }
    throw new baseError('Some error occurred while deleting the item.');    
  }

  async deleteMany(req, session) {
    const response = await this.service.delete(req.params, session);
    if(response) {
      return {
        code: 200,
        result: response,
        message: 'Items was Deleted successfully.'
      }
    }
    throw new baseError('Some error occurred while deleting items.');    
  }
}

module.exports = { baseController };
