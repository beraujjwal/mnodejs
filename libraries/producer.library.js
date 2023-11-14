'use strict';
require('dotenv').config();
const chalk = require('chalk');

const { kafka } = require('../helpers/kafka');
const log = console.log;
let producer = null;
if(kafka) {
  producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000
  });
}
exports.sendMessage = async (messageTopic, messageBody) => {
    try{

        await producer.connect()
        .then((value) => log("Producer connected"))
        .catch((err) => log(chalk.white.bgRed.bold('✘ Kafka producer connect failed!')));

        await producer.send({
          topic: messageTopic,
          messages: [{ value: messageBody }],
        }).then((resp) => {
          log('producerData: ', resp);
        })
        .catch((err) => {
          console.error('error: ', err);
        })
        await producer.disconnect();

    } catch (ex) {
      log(ex);
    }
};

exports.sendKafkaNotification = async (topic, payload) => {
    const message = JSON.stringify(payload);
    await sendMessage(topic, message).catch(console.error);
    log(`Message sent to ${topic}: ${message}`);
};

