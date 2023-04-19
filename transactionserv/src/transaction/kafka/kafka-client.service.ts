import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Message, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaClient {
  private producer: Producer;
  private consumer: Consumer;

  constructor(@Inject('KAFKA_SERVICE') kafka: Kafka) {
    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: 'Transactiongroupid' }); 
  }

  async sendMessage(messageObject: { topic: string; key: string; value: string }): Promise<void> {
    try {
      const { topic, key, value } = messageObject;
      const kafkaMessage: Message = {
        key: key,
        value: value,
      };
      await this.producer.connect();
      await this.producer.send({ topic: topic, messages: [kafkaMessage] });
      console.log('Mensaje enviado a Kafka:', kafkaMessage);
    } catch (error) {
      console.error('Ha ocurrido un error al enviar el mensaje a Kafka:', error.message);
      throw error;
    }
  }

  async consumeMessage(topic: string, onMessageReceived: (data: any) => void): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const messageValue = message.value?.toString();

            if (messageValue) {
              const messageData = JSON.parse(messageValue);
              onMessageReceived(messageData);
            }
          } catch (error) {
            console.error('Ha ocurrido un error al procesar el mensaje recibido de Kafka:', error.message);
            throw error;
          }
        },
      });
    } catch (error) {
      console.error('Ha ocurrido un error al consumir mensajes de Kafka:', error.message);
      throw error;
    }
  }
}
