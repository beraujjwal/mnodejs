'use strict';
const chalk = require('chalk');
const log = console.log;
log(chalk.white.bgGreen.bold('✔ Starting Application'));
require( 'dotenv' ).config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');


log(chalk.white.bgGreen.bold('✔ Bootstrapping Application'));
const app = express();
var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require('./system/route')(express);
app.use( '/api/*', ( req, res, next ) => {
  res.json({ message: "Page Not Found!!" });
});
app.use( '/*', ( req, res, next ) => {
  res.render('404', { title: '404 Page not found', msg: 'Uh oh snap! You are drive to the wrong way' })
});
log(chalk.white.bgGreen.bold('✔ Mapping Routes'));

const PORT = parseInt(process.env.APP_PORT) || 8080;
const MODE = process.env.APP_ENV || 'development';

log(chalk.white.bgGreen.bold(`✔ Mode: ${MODE}`));
log(chalk.white.bgGreen.bold(`✔ Port: ${PORT}`));

// set port, listen for requests
app.listen( PORT ).on( 'error', ( err ) => {
  log(chalk.white.bgGreen.bold('✘ Application failed to start'));
  log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
  process.exit( 0 );
} ).on( 'listening', () => {
log(chalk.white.bgGreen.bold('✔ Application Started'));
} );