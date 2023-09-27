'use strict';
require('dotenv').config();
const { Kafka, logLevel } = require('kafkajs');
const { config } = require('../../config/kafka.config');

const PERFORMANCE_TEST = true;

const serviceLogger = () => ({ label, log }) => {
    if (!PERFORMANCE_TEST) console.log(label + " namespace:" + log.message, log);
};

const brokers = config.brokers.split(',');

exports.kafka =  new Kafka({
  logLevel: logLevel.INFO,
  clientId: config.clientId,
  brokers: brokers,
  logCreator: serviceLogger,
  retry: {
    initialRetryTime: config.retryTime,
    retries: config.retry,
  },
});