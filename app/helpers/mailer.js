'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');
var _ = require('lodash');

const { config, defaultMail } = require('../../config/mail.config');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(config);

exports.send = function (mailOptions) {
  mailOptions = _.merge({}, defaultMail, mailOptions);

  // send mail with defined transport object
  // visit https://nodemailer.com/ for more options
  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) return console.log(error);
    console.log('mail sent:', info.response);
  });
};
