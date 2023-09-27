'use strict';
require('dotenv').config();
exports.config = {
  brokers: process.env.KAFKA_BROKERS,
  clientId: process.env.KAFKA_CLIENT_ID,
  groupId: process.env.KAFKA_GROUP_ID,
  topics: process.env.KAFKA_SUBSCRIBE_TOPIC,
  retry: process.env.KAFKA_RETRT,
  retryTime: process.env.KAFKA_RETRT_TIME,
};
