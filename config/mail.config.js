'use strict';
require('dotenv').config();
const path = require('path');
exports.config = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  //secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
};

exports.defaultMail = {
  from: process.env.DEFAULT_EMAIL,
  subject: process.env.DEFAULT_SUBJECT,
  to: process.env.DEFAULT_EMAIL,
  subject: 'Usha Digital',
  template: 'index',
  attachments: [
    { filename: 'abc.jpg', path: path.resolve(__dirname, './image/abc.jpg')}
  ]
};
