'use strict';
require('dotenv').config();

module.exports = {
  consumerKey: process.env.QUICKBOOKS_CONSUMER_KEY || 'localhost',
  consumerSecret: process.env.QUICKBOOKS_CONSUMER_SECRET || 'localhost',
  oauthToken: process.env.QUICKBOOKS_OAUTH_TOKEN || '27017',
  realmId: process.env.QUICKBOOKS_REALM_ID || 'root',
  refreshToken: process.env.QUICKBOOKS_REFRESH_TOKEN || '123456',
  sandbox: process.env.QUICKBOOKS_SANDBOX || true,
  debugging: process.env.QUICKBOOKS_DEBUG || true
};