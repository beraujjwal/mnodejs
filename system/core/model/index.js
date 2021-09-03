'use strict';
require( 'dotenv' ).config();
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const pluralize = require('pluralize');
const changeCase = require('case');
const uuid = require('uuid');
const dbConfig = require("../../../config/db.config");
const modelsPath = __dirname + '/../../../models/';
const basename = 'index.js';

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.trans = mongoose.connection;

fs
    .readdirSync(modelsPath)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        let modelName = changeCase.pascal( pluralize.singular( file.slice( 0, -8 ) ) );
        //console.log(modelName);
        db[modelName] = require(path.join(modelsPath, file))(mongoose, uuid);
    });

module.exports = db;