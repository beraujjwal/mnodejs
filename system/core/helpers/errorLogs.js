'use strict';
const chalk = require('chalk');

exports.log = (message) => {
  if (typeof message === 'string') {
    console.log(chalk.white.bgGreen.bold(`✔ ${message}`));
  } else {
    console.log(chalk.white.bgGreen.bold(`${message}`));
  }
};

exports.error = (message) => {
  if (typeof message === 'string') {
    console.log(chalk.red.bgBlue.bold(`✘ ${message}`));
  } else {
    console.log(chalk.red.bgBlue.bold(`${message}`));
  }
};

exports.info = (message) => {
  if (typeof message === 'string') {
    console.log(chalk.yellow.bgRed.bold(`✘ ${message}`));
  } else {
    console.log(chalk.yellow.bgRed.bold(`${message}`));
  }
};
