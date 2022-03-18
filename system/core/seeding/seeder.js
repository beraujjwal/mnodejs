'use strict';
const { Seeder } = require('mongo-seeding');
const path = require('path');
const dbConfig = require('../../../config/db.config');
const seederPath = path.resolve(__dirname, '../../../database/seeder/');

const config = {
  database: dbConfig.url,
  inputPath: seederPath,
  dropDatabase: false,
  dropCollections: false,
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  path.resolve('./database/seeder/'),
);

const main = async () => {
  try {
    await seeder.import(collections);
    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

main();
