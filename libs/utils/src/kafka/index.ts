import { Consumer, Kafka, Producer } from "kafkajs";

export async function createTopics(kafka: Kafka, topicNames: Array<string>) {
  const admin = kafka.admin();
  await admin.connect();
  const topics = topicNames.map(topic => ({ topic }))
  const createdTopic = await admin.createTopics({
    validateOnly: true,
    waitForLeaders: false,
    timeout: 60,
    topics,
  })
  console.log(`Topics ${topicNames} has ${createdTopic ? '' : 'not '}been created`)
  await admin.disconnect();
}

export async function startProducer(kafka: Kafka): Promise<Producer> {
  const producer = kafka.producer();

  await producer.connect();
  console.log("Connected to producer.");

  return producer
}

export async function startConsumer(kafka: Kafka, groupId: string): Promise<Consumer> {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  console.log("Connected to consumer.");

  return consumer
}