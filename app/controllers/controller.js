'use strict';
const { baseController } = require('@core/controller/baseController');
var autoBind = require('auto-bind');

class controller extends baseController {
  /**
   * @desc Controller constructor
   *
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
    autoBind(this);
  }
}

module.exports = { controller };
