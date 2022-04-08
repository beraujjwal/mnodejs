'use strict';
const { controller } = require('./controller');
const autoBind = require('auto-bind');

class CONTROLLER_CAMEL_CASE_PLURAL_FORMController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    /*
      	add your line here
      */
    autoBind(this);
  }

  /*
    add your mehods here
  */
}

module.exports = new CONTROLLER_CAMEL_CASE_PLURAL_FORMController();
