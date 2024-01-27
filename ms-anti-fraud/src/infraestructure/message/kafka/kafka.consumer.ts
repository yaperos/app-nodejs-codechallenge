import { Kafka, EachMessagePayload } from 'kafkajs';
import { kafkaConfig } from './kafka.config';
import { producer } from './kafka.producer';

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: 'transactionTopicId' });


export const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transactionTopic' });

  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
        const messageValue = payload.message.value;
        await producer.connect();
        if (messageValue !== null && messageValue !== undefined) {
          console.log('Received message Consumer:', messageValue.toString());
          const messageText = messageValue.toString();
          const data=JSON.parse(messageText);
          const topicToProduce = 'transactionValidateTopic';
          console.log('data',data);
          const id=data.id;
          const value=data.value;
          if(value<1000){
              const dataSend={
                id:id,
                newStatus:'APPROVED'
              }
              const dataString=JSON.stringify(dataSend);
              await producer.send({
                topic:topicToProduce,
                messages:[{value:dataString}]
              });
          }
          else{
            const dataSend={
              id:id,
              newStatus:'REJECT'
            }
            const dataString=JSON.stringify(dataSend);
            await producer.send({
              topic:topicToProduce,
              messages:[{value:dataString}]
            });
          }
          await producer.disconnect(); 
        }
    },
  });
};

