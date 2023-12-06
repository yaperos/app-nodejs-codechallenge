import { type EachMessagePayload, Kafka, Consumer, Producer} from 'kafkajs';

const kafka = new Kafka({
  clientId: 'anti-fraud',
  brokers: ['localhost:9092'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'notification-group' });
const producer: Producer = kafka.producer();

const handleMessage = async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
  console.log(`Received message from topic '${topic}': ${message.value?.toString()}`);

  if (topic === 'new-transaction') {
    console.log('Message received:', message.value?.toString());
    await runProducer(message.value?.toString());
  } else {
    console.log('Unknown topic:', topic);
  }

  await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
};

const runConsumer = async (): Promise<void> => {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'new-transaction' });

  console.log('Consumer subscribed to topics: new-transaction');

  await consumer.run({
    eachMessage: handleMessage,
  });
};

const sendMessage = async (topic: string, message: string): Promise<void> => {
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
};

const sendNotification = async (topic: string, payload: any): Promise<void> => {
  const message = JSON.stringify(payload);
  await sendMessage(topic, message);
  console.log(`Message sent to ${topic}: ${message}`);
};

const runProducer = async (message: any): Promise<void> => {
    let status: string;
    let messageDecoded = JSON.parse(message);
    console.log("---> value received: ", messageDecoded.value);
    if (messageDecoded.value > 1000) {
        status = 'rejected';
    } else {
        status = 'approved';
    }

    const payload = {
      database_id: messageDecoded.database_id,
      status
    };
    console.log("-------> about to produce!")
    await sendNotification('anti-fraud', payload);
  
    // await producer.disconnect();
  };

runConsumer()
  .then(() => {
    console.log('Consumer is running...');
  })
  .catch((error) => {
    console.error('Failed to run kafka consumer', error);
  });