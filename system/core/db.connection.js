'use strict';
const chalk = require('chalk');
const log = console.log;
require('dotenv').config();
const db = require('@core/model');

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    if (process.env.APP_ENV === 'development') {
      log(chalk.white.bgGreen.bold('✔ Connected to database with ', db.url));
    } else {
      log(chalk.white.bgGreen.bold('✔ Connected to the database!'));
    }
  })
  .catch((err) => {
    log(chalk.white.bgGreen.bold('✘ Cannot connect to the database!'));
    log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
    process.exit();
  });

if (process.env.APP_ENV === 'development') {
  db.mongoose.set('debug', true);
}
