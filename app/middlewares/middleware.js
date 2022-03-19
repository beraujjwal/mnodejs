'use strict';
const autoBind = require('auto-bind');
const { ApiResponse } = require('@helper/apiResponse');
const {
  baseMiddleware,
} = require('../../system/core/middleware/baseMiddleware');

class middleware extends baseMiddleware {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.ApiRes = new ApiResponse();
    autoBind(this);
  }
}

module.exports = { middleware };
