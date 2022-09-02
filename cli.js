'use strict';
const chalk = require('chalk');
const log = console.log;
const moduleGenerator = require('./system/generator');

async function main() {
  try {
    const argumentsArr = process.argv.slice(2);
    if (argumentsArr[0].indexOf(':') === 4) {
      let processAction = argumentsArr[0].slice(5);
      let actionArr = [
        'controller',
        'model',
        'service',
        'validation',
        'middleware',
        'route',
        'testCase',
      ];
      if (actionArr.includes(processAction)) {
        await moduleGenerator(argumentsArr);
      } else {
        log(chalk.bgRed.bold('Invalid Make Command'));
      }
    } else {
      throw new Error('Invalid Command');
    }
  } catch (error) {
    log(chalk.white.bgGreen.bold(`✘ Error: ${error.message}`));
  }
}

main();
