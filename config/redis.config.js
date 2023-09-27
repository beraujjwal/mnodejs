'use strict';
require('dotenv').config();
exports.config = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};
