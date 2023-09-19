import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from "kafkajs";

@Injectable()
export class AntiFraudConsumer implements OnApplicationShutdown {
  // Connect to Kafka Server
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092']
  });

  private readonly consumers: Consumer[] = [];

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    
    const consumer = this.kafka.consumer({ groupId: 'antifraud' });

    await consumer.connect();

    await consumer.subscribe(topics);

    await consumer.run(config);
    
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
      for (const consumer of this.consumers) {
      await consumer.disconnect();
    }

  }

}