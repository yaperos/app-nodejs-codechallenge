import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Message, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaClient {
  private producer: Producer;
  private consumer: Consumer;

  constructor(@Inject('KAFKA_SERVICE') kafka: Kafka) {
    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: 'antifraudgroupid' }); 
  }

  async sendMessage(messageObject: { topic: string; key: string; value: string }) {
    const { topic, key, value } = messageObject;
    const kafkaMessage: Message = {
      key: key,
      value: value,
    };
    await this.producer.connect();
    await this.producer.send({ topic: topic, messages: [kafkaMessage] });
    console.log(`Mensaje enviado a Kafka: Topic: ${topic}, Key: ${key}, Value: ${value}`);
  }

  async consumeMessage(topic: string, onMessageReceived: (data: any) => void) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value?.toString();
        //console.log(`Mensaje recibido de Kafka: Topic: ${topic}, Partition: ${partition}, Key: ${message.key?.toString()}, Value: ${messageValue}`);
        
        if (messageValue) {
          const messageData = JSON.parse(messageValue);
          onMessageReceived(messageData);
        }
      },
    });
  }
}
