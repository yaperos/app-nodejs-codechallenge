import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { IConsumer } from "@my-org/common-tools";
import { KafkajsConsumer } from "./kafkajs.consumer";
import { ConfigService } from "@nestjs/config";
import { IKafkajsConsumerOptions } from "./kafkajs-consumer-options.interface";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  constructor(private readonly configService: ConfigService) {}

  private readonly consumers: IConsumer[] = [];

  async consume({ topic, config, onMessage }: IKafkajsConsumerOptions) {
    const consumer = new KafkajsConsumer(
      topic,
      config,
      this.configService.get("KAFKA_BROKER")
    );
    await consumer.connect();
    await consumer.consume(onMessage);

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
