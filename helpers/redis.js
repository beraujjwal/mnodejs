'use strict';
const { baseError } = require('@error/baseError');
const { config } = require('../config/redis.config');
const redis = require('redis');

let redisClient = null;

if(config.host) {
  redisClient = redis.createClient({
    port      : config.port,
    host      : config.host,
    url       : config.url
  });
}

module.exports = { redisClient };