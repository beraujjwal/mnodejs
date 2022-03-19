'use strict';
require('dotenv').config();
var i18n = require('i18n');

i18n.configure({
  // setup some locales
  locales: process.env.LANGUAGES_SHOT_NAME,
  defaultLocale: process.env.DEFAULT_LANGUAGE,
  header: 'accept-language',
  queryParameter: 'lang',
  // where to store json files
  directory: __dirname + '/../resources/locales',
  directoryPermissions: '755',
  extension: '.json',
  /*api: {
		'__': 'translate',  
		'__n': 'translateN' 
	},*/
  register: global,
});

module.exports = async function (req, res, next) {
  const headres = req.headers;
  i18n.init(req, res);
  let lang = process.env.DEFAULT_LANGUAGE;
  if (headres['accept-language']) {
    lang = headres['accept-language'];
  }
  console.log(`Current language is ${lang}`);
  i18n.setLocale(lang);
  return next();
};
