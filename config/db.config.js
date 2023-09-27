'use strict';
require('dotenv').config();

let url = process.env.DB_CONNECTION_URL;
// if(process.env.DB_USERNAME && process.env.DB_PASSWORD) {
//   //url =`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME},${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongo-two-db:${process.env.DB_PORT}/${process.env.DB_NAME},${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongo-three-db:${process.env.DB_PORT}/${process.env.DB_NAME}?readPreference=primary&authMechanism=DEFAULT&authSource=admin&replicaSet=myRepl`; //&retryWrites=false`; //
//   //url =`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?readPreference=primary&authMechanism=DEFAULT&authSource=admin&replicaSet=myRepl`; //&retryWrites=false`; //

//   url = `mongodb://admin:DP7PxiA6Gof@mongo1:27014,mongo2:27015,mongo3:27016/users?replicaSet=rs0`;

// } else {
//   url =`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME},mongo-two-db:${process.env.DB_PORT}/${process.env.DB_NAME},mongo-three-db:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// }

module.exports = {
  url: url,
  host: process.env.DB_HOST || 'localhost',
  post: process.env.DB_PORT || '27017',
  username: process.env.DB_USERNAME || 'root',
  passwortd: process.env.DB_PASSWORD || '123456',
  name: process.env.DB_NAME || 'users'
};

