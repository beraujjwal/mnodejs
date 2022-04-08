'use strict';
require('dotenv').config();
let dbName =
  process.env.APP_ENV == 'test'
    ? process.env.DB_DATABASE + '-test'
    : process.env.DB_DATABASE;

module.exports = {
  url:
    process.env.DB_CONNECTION +
    '://' +
    process.env.DB_HOST +
    ':' +
    parseInt(process.env.DB_PORT) +
    '/' +
    dbName,
};
