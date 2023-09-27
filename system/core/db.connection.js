'use strict';
const chalk = require('chalk');
const log = console.log;
require('dotenv').config();
const db = require('./model');

function connectDB(db) {
  try {
    db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      replicaSet      : 'rs0',
      //user: process.env.DB_USERNAME,
      //pass: process.env.DB_PASSWORD
    }).then(() => {
      if (process.env.APP_ENV !== 'production') {
        log(chalk.white.bgGreen.bold('✔ Connected to database with ', db.url));
      } else {
        log(chalk.white.bgGreen.bold('✔ Connected to the database!'));
      }
    }).catch(err => {
      console.log(err);
      log(chalk.white.bgGreen.bold('✘ Cannot connect to the database with ', db.url));
      log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
      process.exit();
    });

  } catch (err) {
    log(chalk.white.bgGreen.bold('✘ Cannot connect to the database!'));
    log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
  }
}

function connectDecorator(func) {
  let cache = new Map();

  return function (db) {
    if (cache.has(db)) {
      return cache.get(db);
    }
    let result = func(db);
    cache.set(db, result);
    return result;
  };
}

connectDB = connectDecorator(connectDB);
connectDB(db);

if (process.env.APP_ENV === 'development') {
  db.mongoose.set('debug', true);
}
