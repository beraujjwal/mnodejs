const autoBind = require('auto-bind');
const { service } = require('@service/service');
const { baseError } = require('@error/baseError');

class SERVICE_CAMEL_CASE_SINGULAR_FROM extends service {
  /**
   * service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    /**
     * Your code goes here
     */
    autoBind(this);
  }

  /**
   *
   * @param {*} queries
   * @returns
   */
  async sampleFunction(queries) {
    /**
     * samle function
     */
  }
}

module.exports = { SERVICE_CAMEL_CASE_SINGULAR_FROM };
