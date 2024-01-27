import { Kafka, EachMessagePayload } from 'kafkajs';
import { kafkaConfig } from './kafka.config';
import { producer } from './kafka.producer';
import {  Status, TransactionData, topics } from '../../../helper/type.helper';
import { TransactionValidCase } from '../../../application/transaction';
import Logger from '../../logger/logger.config';


const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: 'transactionTopicId' });
const trxValid=new TransactionValidCase();
const logger=new Logger();

export const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.TOPIC_CONSUMER });
  const topicToProduce = topics.TOPIC_PRODUCER;
  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
        const messageValue = payload.message.value;
        await producer.connect();
        if (messageValue !== null && messageValue !== undefined) {
          const messageText = messageValue.toString();
          const data=JSON.parse(messageText);
          logger.info(`data recibida ${messageText}`);
          const value=data.value;
          let newStatus:Status=trxValid.validTransaction(value);
          const dataSend:TransactionData={
            id:data.id,
            newStatus:newStatus
          }
          const dataString=JSON.stringify(dataSend);
          logger.info(`data emitida ${dataString}`);
          await producer.send({
            topic:topicToProduce,
            messages:[{value:dataString}]
          });
          await producer.disconnect(); 
        }
    },
  });
};

