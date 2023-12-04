import { type EachMessagePayload, Kafka, Consumer} from 'kafkajs';

const kafka = new Kafka({
  clientId: 'anti-fraud',
  brokers: ['localhost:9092'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'notification-group-af' });

const handleMessage = async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
  console.log(`Received message from topic '${topic}': ${message.value?.toString()}`);

  if (topic === 'anti-fraud') {
    // Handle new-transaction notification
    console.log('Message received:', message.value?.toString());
  } else {
    console.log('Unknown topic:', topic);
  }

  await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
};

const runConsumer = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'anti-fraud' });

  console.log('Consumer subscribed to topics: anti-fraud');

  await consumer.run({
    eachMessage: handleMessage,
  });
};

runConsumer()
  .then(() => {
    console.log('Consumer is running...');
  })
  .catch((error) => {
    console.error('Failed to run kafka consumer', error);
  });