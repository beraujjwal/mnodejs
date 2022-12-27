'use strict';
require('dotenv').config();

module.exports = {
  url: process.env.DB_CONNECTION_URL || 'mongodb://mongodb:27017/nodeapp',
};
