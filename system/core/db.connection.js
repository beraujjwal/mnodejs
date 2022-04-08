'use strict';
const chalk = require('chalk');
const log = console.log;
require('dotenv').config();
const db = require('./model');
/*
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
*/
function connectDB(db) {
  try {
    db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    if (process.env.APP_ENV !== 'production') {
      log(chalk.white.bgGreen.bold('✔ Connected to database with ', db.url));
    } else {
      log(chalk.white.bgGreen.bold('✔ Connected to the database!'));
    }
  } catch (err) {
    log(chalk.white.bgGreen.bold('✘ Cannot connect to the database!'));
    log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
  }
}

function connectDecorator(func) {
  let cache = new Map();

  return function (db) {
    if (cache.has(db)) {
      // if there's such key in cache
      return cache.get(db); // read the result from it
    }

    let result = func(db); // otherwise call func

    cache.set(db, result); // and cache (remember) the result
    return result;
  };
}

connectDB = connectDecorator(connectDB);

connectDB(db);

if (process.env.APP_ENV === 'development') {
  db.mongoose.set('debug', true);
}
