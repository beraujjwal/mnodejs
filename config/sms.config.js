'use strict';
require('dotenv').config();
const path = require('path');
exports.config = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  verifySid: process.env.TWILIO_VERIFY_SID,
};
