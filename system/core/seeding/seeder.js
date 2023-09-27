'use strict';
require('dotenv').config();
const chalk = require('chalk');
const log = console.log;
const { Seeder } = require('mongo-seeding');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../../../config/db.config');
const seederPath = path.resolve(__dirname, '../../../database/seeder/');
const servicePath = path.resolve(__dirname + '/../../../neo4j/services/');

const pluralize = require('pluralize');
const caseChanger = require('case');
const basename = 'index.js';
const config = {
  database: dbConfig.url,
  inputPath: seederPath,
  dropDatabase: false,
  dropCollections: true,
  databaseReconnectTimeout: 3000
};

log(chalk.white.bgGreen.bold('✔ Seeding process started'));
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(seederPath);
log(chalk.white.bgGreen.bold('✔ Reading collections file done.'));

const sedding = [];

fs.readdirSync(servicePath)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  }).forEach((file) => {
    let moduleName = file.slice(0, -3);
    sedding[moduleName] = require(path.join(servicePath, moduleName));
  });

//const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const main = async () => {
  try {
    log(chalk.white.bgGreen.bold('✔ MongoDB migration started.'));
    await seeder.import(collections);
    log(chalk.white.bgGreen.bold('✔ MongoDB migration ended.'));
    log(chalk.white.bgGreen.bold('✔ Neo4j migration started.'));

    await collections.forEach( async collection => {
      const singularModelName = pluralize.singular(collection.name);
      const documents = collection.documents;
      const neo4jService = sedding[singularModelName]
      if(neo4jService) {
        log(chalk.white.bgGreen.bold(`✔ Neo4J seeding for ${singularModelName}`));
        await documents.forEach( async (document) => {
          document.id = document._id;
          await neo4jService.create(document);
          //await sleep(10000);
        });
      }
    });
    log(chalk.white.bgGreen.bold('✔ Seed complete!'));
    //process.exit(0);
  } catch (err) {
    console.log(err)
    log(chalk.white.bgGreen.bold('✘ Seeding process failed!'));
    //process.exit(0);
  }

};

main();