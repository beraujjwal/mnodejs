'use strict';
const chalk = require('chalk');
const log = console.log;
const fs = require('fs');
const modelsPath = __dirname + '/../../../models';
require('../db.connection');
const caseChanger = require('case');
const db = require('../model');

// Loop models path and loads every file as a model except index file
const models = fs.readdirSync(modelsPath).filter((file) => {
  return (
    file.indexOf('.') !== 0 && file !== 'index' && file.slice(-3) === '.js'
  );
});

const deleteModelFromDB = (model) => {
  return new Promise((resolve, reject) => {
    let pascalSingularModelName = caseChanger.pascal(model.slice(0, -9));
    db[pascalSingularModelName].deleteMany({}, (err, row) => {
      if (err) {
        reject(err);
      } else {
        log(
          chalk.white.bgGreen.bold(
            `✔ Cleanup for ${pascalSingularModelName} complete!`,
          ),
        );
        resolve(row);
      }
    });
  });
};

const clean = async () => {
  try {
    const promiseArray = models.map(async (model) => {
      await deleteModelFromDB(model);
    });
    await Promise.all(promiseArray);

    log(chalk.white.bgGreen.bold('✔ Cleanup for all connections complete!'));
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

clean();
