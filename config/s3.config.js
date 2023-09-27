'use strict';
require('dotenv').config();

module.exports = {
  bucketName: process.env.AWS_BUCKET_NAME || 'bucketName',
  region: process.env.AWS_BUCKET_REGION || 'region',
  accessKeyId: process.env.AWS_ACCESS_KEY || 'accessKeyId',
  secretAccessKey: process.env.AWS_SECRET_KEY || 'secretAccessKey'
};