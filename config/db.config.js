'use strict';
require( 'dotenv' ).config();

module.exports = {
    url: process.env.DB_CONNECTION + "://" + process.env.DB_HOST + ":" + parseInt(process.env.DB_PORT) + "/" + process.env.DB_DATABASE
};