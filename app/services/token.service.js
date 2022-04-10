const autoBind = require('auto-bind');
const { service } = require('@service/service');

class token extends service {
  /**
   * services constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    this.regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    autoBind(this);
  }
}

module.exports = { token };
