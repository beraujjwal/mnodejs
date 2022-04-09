'use strict';
const autoBind = require('auto-bind');
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
    autoBind(this);
  }
}

module.exports = { middleware };
