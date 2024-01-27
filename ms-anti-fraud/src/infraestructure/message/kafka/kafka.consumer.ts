import { Kafka, EachMessagePayload } from 'kafkajs';
import { kafkaConfig } from './kafka.config';
import { producer } from './kafka.producer';
import { AMOUNT_MAX, Status, TransactionData, topics } from '../../../helper/type.helper';
import { TransactionValidCase } from '../../../application/transaction';

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: 'transactionTopicId' });
const trxValid=new TransactionValidCase();

export const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.TOPIC_CONSUMER });

  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
        const messageValue = payload.message.value;
        const topicToProduce = topics.TOPIC_PRODUCER;
        await producer.connect();
        if (messageValue !== null && messageValue !== undefined) {
          const messageText = messageValue.toString();
          const data=JSON.parse(messageText);
          const value=data.value;
          let newStatus:Status=trxValid.validTransaction(value);
          const dataSend:TransactionData={
            id:data.id,
            newStatus:newStatus
          }
          const dataString=JSON.stringify(dataSend);
          await producer.send({
            topic:topicToProduce,
            messages:[{value:dataString}]
          });
          await producer.disconnect(); 
        }
    },
  });
};

