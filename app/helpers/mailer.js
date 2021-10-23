'use strict';
require( 'dotenv' ).config();
const nodemailer = require("nodemailer");
var _ = require('lodash');	

const { config, defaultMail } = require('@helper/mailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(config);

exports.send = function (mail)
{
    mail = _.merge({}, defaultMail, mail);

	// send mail with defined transport object
	// visit https://nodemailer.com/ for more options
	return transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
};