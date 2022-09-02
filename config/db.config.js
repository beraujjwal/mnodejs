'use strict';
require('dotenv').config();

module.exports = {
  url: process.env.DB_CONNECTION_URLb || "mongodb://mongodb:27017/nodeapp"
};
