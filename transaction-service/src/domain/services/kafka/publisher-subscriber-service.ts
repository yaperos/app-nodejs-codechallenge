import { Consumer, Producer } from "kafkajs";
import { PublisherSubscriberService } from "../ports";

export class KafkaPublisherSubscriberService
  implements PublisherSubscriberService
{
  private listeners: ((message: string) => void)[];

  constructor(private producer: Producer, private consumer: Consumer) {
    this.listeners = [];
  }

  public async emit(value: string): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic: "transaction-created",
      messages: [{ value: value }],
    });
    await this.producer.disconnect();
  }

  public addListenerForConsume(callback: (message: string) => void): void {
    this.listeners.push(callback);
  }

  public async consume(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: "transaction-processed",
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          for (const listener of this.listeners) {
            listener(message.value?.toString());
          }
        }
      },
    });
  }
}
