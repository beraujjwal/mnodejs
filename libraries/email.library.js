'use strict';
require('dotenv').config();
const { sendMail } = require('../app/helpers/mailer');
const path = require('path');


exports.sentOTPMail = function (email, token) {
    try {
        const filePath = path.join(__dirname, '../resources/templates/views/index.handlebars');    
        const mailOptions = {
            to: email,
            subject: 'User registration',
            template: 'index',
            context: {
                token: token
            },
            attachments: [
                { filename: 'logo.jpg', path: path.resolve(__dirname, '../resources/templates/images/logo.jpg')}
            ]
        };

        sendMail(mailOptions);
    } catch (ex) {
        console.log(ex);
    }
};