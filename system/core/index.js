'use strict';
require('module-alias/register');
const chalk = require('chalk');
const log = console.log;
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');

const i18n = require('../../config/i18n');
const routers = require('../route');
const winston = require('../../config/winston');
const limiter = require('../../config/rateLimit');
const { errorResponse } = require('./helpers/apiResponse');

log(chalk.white.bgGreen.bold('✔ Bootstrapping Application'));
const app = express();

var corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '20mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// To remove data using these defaults:
app.use(mongoSanitize());

// i18n
app.use(i18n);

//Basic rate-limiting middleware for Express.
app.use(limiter);

//Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());

// replace with the directory path below ./
app.set('views', path.join(__dirname, 'resources/views'));

//Set view engine
app.set('view engine', 'pug');

//set the path of the assets file to be used
app.use(express.static(path.join(__dirname, './public')));

const PORT = parseInt(process.env.APP_PORT) || 5445;
const MODE = process.env.APP_ENV || 'development';

log(chalk.white.bgGreen.bold(`✔ Mode: ${MODE}`));
log(chalk.white.bgGreen.bold(`✔ Port: ${PORT}`));

require('./db.connection');

//don't show the log when it is test
if (process.env.APP_ENV === 'development') {
  app.use(logger('dev', { stream: winston.stream }));
}

log(chalk.white.bgGreen.bold('✔ Mapping Routes'));

//Route Prefixes
app.use('/', routers);

// var options = {
//   explorer: true,
// };

const swaggerDocument = require('../../swagger.json');
const swaggerUiOptions = {
  swaggerOptions: {
    basicAuth: {
      name: 'x-access-token',
      schema: {
        type: 'basic',
        in: 'header',
      },
      value: '<user:token>',
    },
  },
};

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerUiOptions),
);

app.all('/api/*', (req, res) => {
  res.json({ message: 'Page Not Found!!' });
});
app.all('/*', (req, res) => {
  res.render('404', {
    title: '404 Page not found!',
    msg: 'Uh oh snap! You are drive to the wrong way',
  });
});

//log(chalk.white.bgGreen.bold('✔ Starting Application'));

// set port, listen for requests
app
  .listen(PORT)
  .on('error', (err) => {
    log(chalk.white.bgGreen.bold('✘ Application failed to start'));
    log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
    process.exit(0);
  })
  .on('listening', () => {
    log(chalk.white.bgGreen.bold('✔ Application Started'));
  });

app.use(function (err, req, res) {
  // set locals, only providing error in development
  log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (MODE !== 'test') {
    // add this line to include winston logging
    winston.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`,
    );
  }

  return res.status(200).json(errorResponse(err));
});

module.exports = app; // for testing
