'use strict';
require( 'dotenv' ).config();
const i18n = require('i18n');

i18n.configure({
    // setup some locales
    locales:['en', 'bn', 'hi'],
    defaultLocale: 'bn',
    queryParameter: 'lang',
    // where to store json files
    directory: __dirname + '/../resources/locales',
    // api: {
    //     '__': 'translate',  
    //     '__n': 'translateN' 
    // },
    register: global  
});
 
module.exports = async function(req, res, next) { 
    const headres = req.headers;
    i18n.init(req, res);
    const lang = headres['accept-language'] || 'en';
    i18n.setLocale(lang);
    return next();
};