'use strict';
/*const seederConfig = require('../../../config/seeder.config');
const db = require('../model');

var countries = require('../../../database/seeder/1649652613675.countries');
var states = require('../../../database/seeder/1649652614675.states');
var cities = require('../../../database/seeder/1649652615675.cities');
var permissions = require('../../../database/seeder/1649652610675.permissions');
var resources = require('../../../database/seeder/1649652611675.resources');
var roles = require('../../../database/seeder/1649652612675.roles');

async function _runCountriesSeeder() {
  async.each(
    countries,
    function iteratee(country, next) {
      var cn = new Country({
        _id: country.id,
        sortname: country.sortname,
        name: country.name,
      });

      cn.save(function (err, res) {
        next();
      });
    },
    function () {
      console.log('================= All Countries loaded ===================');
    },
  );
}
*/
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
const collections = seeder.readCollectionsFromPath(seederPath);

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
