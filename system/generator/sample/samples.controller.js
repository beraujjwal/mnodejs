'use strict';
const autoBind = require('auto-bind');
const { controller } = require('./controller');
const {
  CONTROLLER_CAMEL_CASE_SINGULAR,
} = require('@service/CONTROLLER_CAMEL_CASE_SINGULAR.service');
const CONTROLLER_CAMEL_CASE_SINGULARService =
  new CONTROLLER_CAMEL_CASE_SINGULAR('MODEL_SINGULAR_FORM');

class CONTROLLER_CAMEL_CASE_PLURAL_FORMController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
    this.service = service;
    /*
      	add your line here
      */
    autoBind(this);
  }

  /*
    add your mehods here
  */
}

module.exports = new CONTROLLER_CAMEL_CASE_PLURAL_FORMController(
  CONTROLLER_CAMEL_CASE_SINGULARService,
);
