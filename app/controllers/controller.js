'use strict';
const { baseController } = require('@core/controller/baseController');
const { ApiResponse } = require('@helper/apiResponse');
var autoBind = require('auto-bind');

class controller extends baseController {
  /**
   * @desc Controller constructor
   *
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.ApiRes = new ApiResponse();
    autoBind(this);
  }
}

module.exports = { controller };
