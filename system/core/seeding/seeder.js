'use strict';
const chalk = require('chalk');
const log = console.log;
const { Seeder } = require('mongo-seeding');
const path = require('path');
const dbConfig = require('../../../config/db.config');
const seederPath = path.resolve(__dirname, '../../../database/seeder/');

const config = {
  database: dbConfig.url,
  inputPath: seederPath,
  dropDatabase: false,
  dropCollections: true,
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  path.resolve(__dirname, '../../../database/seeder/'),
);

const main = async () => {
  try {
    await seeder.import(collections);
    log(chalk.white.bgGreen.bold('✔ Seed complete!'));
    process.exit(0);
  } catch (err) {
    process.exit(0);
  }
};

main();
