'use strict';
const { baseValidation } = require('@core/validation/baseValidation');
var autoBind = require('auto-bind');

class validation extends baseValidation {
  /**
   * @desc Controller constructor
   *
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    autoBind(this);
  }
}

module.exports = { validation };
