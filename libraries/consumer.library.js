'use strict';
require('dotenv').config();
const chalk = require('chalk');

const { kafka } = require('../app/helpers/kafka');
const { consumerCallTopicsService } = require('../kafka');
const log = console.log;
const groupId = process.env.KAFKA_GROUP_ID;
const topicsString = process.env.KAFKA_SUBSCRIBE_TOPICS;
let topics = [];
let consumerKafkaMessage = function() { return undefined; };

if(kafka) {

  if(topicsString)
    topics = topicsString.split(',');

  consumerKafkaMessage = async () => {
    try{
      if(topicsString && groupId) {
        const consumer = kafka.consumer({ groupId: groupId });
        await consumer.connect().then((value) => console.log("Consumer connected"))
        .catch((err) => log(chalk.white.bgRed.bold('✘ Kafka consumer connect failed!')));

        if(topics.length > 0) {
          topics.forEach(topic => {
            if(topic.length > 0) consumer.subscribe({ topic: topic });
          });
        }

        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            await consumerCallTopicsService(topic, partition, message);
          },
        });
      }

    } catch (ex) {
      console.log(ex);
    }
  };
}

module.exports = { consumerKafkaMessage };
