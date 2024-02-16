import { KafkaClient } from './kafka/kafka.client';

async function bootstrap() {
  const kafkaClient = new KafkaClient();
  kafkaClient.consumeMessage();
}

bootstrap();
