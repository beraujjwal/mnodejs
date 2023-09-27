'use strict';
const autoBind = require('auto-bind');
const { Kafka, logLevel } = require('kafkajs');
const db = require('../model');
require('dotenv').config();


class index {
  /**
   * Base Controller Layer
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    this.db = db;
    this.env = process.env;
    autoBind(this);
    
  }

  
}

module.exports = { base: index };
