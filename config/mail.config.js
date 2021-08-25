'use strict';
require( 'dotenv' ).config();


let config = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // process.env.EMAIL_SMTP_SECURE true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
};

var defaultMail = {
    from: process.env.DEFAULT_EMAIL,
    subject: process.env.DEFAULT_SUBJECT,
};





module.exports = { config, defaultMail }