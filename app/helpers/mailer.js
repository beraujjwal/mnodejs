'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { baseError } = require('@error/baseError');
const { config, defaultMail } = require('../../config/mail.config');

const viewPath =  path.resolve(__dirname, '../../resources/templates/views/');
const partialsPath = path.resolve(__dirname, '../../resources/templates/partials');


exports.sendMail = function (mailOptions) {
  mailOptions = { ...defaultMail, ...mailOptions };

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport(config);

  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.handlebars',
      // partialsDir: viewPath,
      layoutsDir: viewPath,
      defaultLayout: false,
      partialsDir: partialsPath,
    },
    viewPath: viewPath,
    extName: '.handlebars',
  }))

  // send mail with defined transport object
  // visit https://nodemailer.com/ for more options
  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) return console.log(error);
    console.debug('mail sent:', info.response);
  });
};
