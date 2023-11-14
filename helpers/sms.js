'use strict';
require('dotenv').config();
const { baseError } = require('@error/baseError');
const { config } = require('../config/sms.config');

exports.sendSMS = function (smsOptions) {
    console.log(smsOptions);
    return true;
};
