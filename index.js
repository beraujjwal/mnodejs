'use strict';
const chalk = require('chalk');
const log = console.log;
require('dotenv').config();
const app = require('./system/core/');

//Set view engine
app.set('view engine', 'pug');

const PORT = parseInt(process.env.APP_PORT) || 5445;

// set port, listen for requests
app
  .listen(PORT)
  .on('error', (err) => {
    log(chalk.white.bgGreen.bold('✘ Application failed to start'));
    log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
    process.exit(0);
  })
  .on('listening', () => {
    log(chalk.white.bgGreen.bold('✔ Application Started'));
  });