'use strict';
require('module-alias/register');
const chalk = require('chalk');
const log = console.log;
require('dotenv').config();
log(chalk.white.bgGreen.bold('✔ Bootstrapping Application'));
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

const i18n = require('../../config/i18n.config');
//const Sentry = require('@sentry/node');
const winston = require('../../config/winston');
const { errorResponse } = require('./helpers/apiResponse');
const { consumerKafkaMessage } = require('../../libraries/consumer.library');
const limiter = require('../../config/rateLimit.config');
const app = express();
let apiHitCount = 0;

// Sentry.init({
//   dsn: "https://e8bf701c3e4444ea9a9f1d0725cac7ce@o4505588600471553.ingest.sentry.io/4505589025079296",
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({ tracing: true }),
//     // enable Express.js middleware tracing
//     new Sentry.Integrations.Express({
//       // to trace all requests to the default router
//       app,
//       // alternatively, you can specify the routes you want to trace:
//       // router: someRouter,
//     }),
//   ],
//   tracesSampleRate: 1.0,
//   debug: false
// });

const corsOptions = {
  credentials: true,
  allowedHeaders: '*',
  origin: '*',
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

// To remove data using these defaults:
app.use(mongoSanitize());

// i18n
app.use(i18n);

//Basic rate-limiting middleware for Express.
app.use(limiter);

//Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());

const PORT = parseInt(process.env.APP_PORT) || 5445;
const MODE = process.env.APP_ENV || 'development';

log(chalk.white.bgGreen.bold(`✔ Mode: ${MODE}`));
log(chalk.white.bgGreen.bold(`✔ Port: ${PORT}`));

require('./db.connection');

//don't show the log when it is test
if (process.env.APP_ENV === 'development') {
  app.use(logger('dev', { stream: winston.stream }));
}
//app.use(Sentry.Handlers.requestHandler());
log(chalk.white.bgGreen.bold('✔ Mapping Routes'));
//app.use(Sentry.Handlers.tracingHandler());

app.use(function (req, res, next) {
  apiHitCount++
  winston.info(
    `${apiHitCount} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );
  next();
});

const routers = require('../route');
//Route Prefixes
app.use('/', routers);

app.all('/*', (req, res) => {
  //Sentry.captureException(new Error('Request location not found in User Service'));
  res.status(404).json({
    code: 404,
    error: true,
    indicate: "Page not Found",
    message: 'Request location not found in User Service'
  });
});

consumerKafkaMessage().catch(console.error);

app.use(function (err, req, res, next) {

  const code = err.code || err.statusCode;
  if (MODE !== 'test') {
    winston.error(
      `${code || 500} - ${err.toString()} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
  }

  //Sentry.captureException(err);
  return res.status(code || 500).json(errorResponse(err, code || 500));
});

//Sentry.close().then(() => process.exit(0));
//app.use(Sentry.Handlers.errorHandler());


module.exports = app;
