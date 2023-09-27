'use strict';
require('dotenv').config();

const { xxxxx } = require('./users');

exports.consumerCallTopicsService = function(messageBody) {
    try{
        switch (topic) {
        case 'xxxxx':
            xxxxx(message);
            break;
        default:
            break;
        }
    } catch(ex){
        console.log(ex);
    }
};