const autoBind = require('auto-bind');
const { service } = require('@service/service');

class SERVICE_CAMEL_CASE_SINGULAR_FROM extends service {
  /**
   * service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
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
