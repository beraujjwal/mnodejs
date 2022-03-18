'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const routesPath = __dirname + '/../../routes/';

var app = express();

fs.readdirSync(routesPath)
  .filter((file) => {
    if (file.indexOf('.') !== 0 && file.slice(-3) === '.js') {
      return file;
    }

    var innerDirPath = routesPath + file + '/';
    fs.readdirSync(innerDirPath)
      .filter((innerFile) => {
        return innerFile.indexOf('.') !== 0 && innerFile.slice(-3) === '.js';
      })
      .forEach((innerFile) => {
        let routeName = require(path.join(innerDirPath, innerFile));
        app.use('/' + file + '/', routeName);
      });
  })
  .forEach((file) => {
    let routeName = require(path.join(routesPath, file));
    app.use('/', routeName);
  });

module.exports = app;
