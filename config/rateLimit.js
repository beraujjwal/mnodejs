'use strict';
require('dotenv').config();
const rateLimit = require('express-rate-limit');
module.exports = rateLimit({
  max: parseInt(process.env.MAX_REQUEST_LIMIT) || 100, // limit each IP to 100 max requests per windowsMS
  windowMs: parseInt(process.env.MAX_REQUEST_IN_TIME) || 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests', // message to send
});
