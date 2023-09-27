'use strict';
require('dotenv').config();
const { sendSMS } = require('../app/helpers/sms');


exports.sentOTPSMS = function (email, token) {
    try {
        const smsOptions = {
            otpCode: 100533
        };

        sendSMS(smsOptions);
    } catch (ex) {
        console.log(ex);
    }
};