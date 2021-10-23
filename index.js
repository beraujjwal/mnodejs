'use strict';
require('module-alias/register')
const chalk = require('chalk');
const log = console.log;
log(chalk.white.bgGreen.bold('✔ Starting Application'));
require( 'dotenv' ).config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const uuid = require('uuid');


log(chalk.white.bgGreen.bold('✔ Bootstrapping Application'));
const app = express();
const router = express.Router();
var corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// replace with the directory path below ./
app.set('views', path.join(__dirname, 'resources/views'));

//Set view engine
app.set('view engine', 'pug');

//set the path of the assets file to be used
app.use(express.static(path.join(__dirname, './public')));


const db = require('@core/model');
           
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
  .then(() => {
    log(chalk.white.bgGreen.bold('✔ Connected to the database!'));
})
  .catch(err => {
    log(chalk.white.bgGreen.bold('✘ Cannot connect to the database!'));
    log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
    process.exit();
});

function initial() {
  db.Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new db.Role({
        _id:  uuid.v4(),
        name: "User",
        slug: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new db.Role({
        _id:  uuid.v4(),
        name: "Moderator",
        slug: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new db.Role({
        _id:  uuid.v4(),
        name: "Admin",
        slug: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

initial();


require('./system/route')(app, router);

app.all( '/api/*', ( req, res, next ) => {
  res.json({ message: 'Page Not Found!!' });
});
app.all( '/*', ( req, res, next ) => {
  res.render('404', { title: '404 Page not found!', msg: 'Uh oh snap! You are drive to the wrong way' })
});


log(chalk.white.bgGreen.bold('✔ Mapping Routes'));

const PORT = parseInt(process.env.APP_PORT) || 8080;
const MODE = process.env.APP_ENV || 'development';

log(chalk.white.bgGreen.bold(`✔ Mode: ${MODE}`));
log(chalk.white.bgGreen.bold(`✔ Port: ${PORT}`));

// set port, listen for requests
app.listen( PORT ).on( 'error', ( err ) => {
  log(chalk.white.bgGreen.bold('✘ Application failed to start'));
  log(chalk.white.bgGreen.bold(`✘ Error: ${err.message}`));
  process.exit( 0 );
} ).on( 'listening', () => {
  log(chalk.white.bgGreen.bold('✔ Application Started'));
} );