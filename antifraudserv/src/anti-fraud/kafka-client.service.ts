import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Message, Producer, Consumer, Partitioners } from 'kafkajs';

@Injectable()
export class KafkaClient {
  private producer: Producer;
  private consumer: Consumer;
  private kafka: Kafka;

  constructor(@Inject('KAFKA_SERVICE') kafka: Kafka) {
    // Inyección del obj Kafka en el constructor
    this.kafka = kafka;
    // Productor y un consumidor - Kafka
    // Uso del LegacyPartitioner para el productor (compatbilidad)
    this.producer = this.kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    this.consumer = this.kafka.consumer({ groupId: 'antifraudgroupid' });
    // Empezamos la conexión :)
    this.connect();
  }

  async connect() {
    // Conex del prod y el cons al server Kafka
    await this.producer.connect();
    await this.consumer.connect();
  }

  async sendMessage(messageObject: { topic: string; key: string; value: string }) {
    // Extraemos los valores de las propiedades
    const { topic, key, value } = messageObject;
    // Creamos un obj de msg para Kafka
    const kafkaMessage: Message = {
      key: key,
      value: value,
    };

    try {
      await this.producer.connect();
      await this.producer.send({ topic: topic, messages: [kafkaMessage] });
      // Esperamos conex y enviamos el msg al server Kafka
      console.log(`Mensaje enviado a Kafka: Topic: ${topic}, Key: ${key}, Value: ${value}`);
    } catch (err) {
      // Si hay error, lo imprimimos en consola
      console.error(`Error al enviar mensaje a Kafka: ${err.message}`);
    }
  }

  async listenToTransactionCreated(onMessageReceived: (data: any) => void) {
    // Suscripción al tema de "transaction_created" desde el principio
    await this.consumer.subscribe({ topic: 'transaction_created', fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        // Conversión del msg recibido a una cadena y luego lo analizamos como JSON
        const messageValue = message.value?.toString();

        if (messageValue) {
          const messageData = JSON.parse(messageValue);
          // Llamada a onMessageReceived y le pasamos el obj de mensaje analizado
          onMessageReceived(messageData);
        }
      },
    });
  }

  async consumeMessage(topic: string, onMessageReceived: (data: any) => void) {
    try {
      // Suscripción al topic y configuracion para leer desde el principio
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      // Se corre el consumidor para leer los mensajes del topic
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          // Extrccion, procesamiento y parseo a json del valor del mensaje
          const messageValue = message.value?.toString();
          if (messageValue) {
            const messageData = JSON.parse(messageValue);
            onMessageReceived(messageData);
          }
        },
      });
    } catch (err) {
      // Si ocurre un error se muestra el mensaje en consola
      console.error(`Error al procesar mensaje de Kafka: ${err.message}`);
    }
  }

  // Desconex del prod y el cons al server Kafka
  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
  
}
