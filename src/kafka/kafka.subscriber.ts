import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaClient, Consumer, Message } from 'kafka-node';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from 'src/transactions/transaction.service';
import { AntiFruadService } from 'src/antiFraud/antiFraud.service';

@Injectable()
export class KafkaSubscriber implements OnModuleInit {
  private kafkaClient: KafkaClient;
  private consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly antiFruadService: AntiFruadService,
  ) {}

  async onModuleInit() {
    try {
      const kafkaHost = this.configService.get<string>('KAFKA_HOST');
      this.kafkaClient = new KafkaClient({ kafkaHost });

      this.consumer = new Consumer(
        this.kafkaClient,
        [
          { topic: 'transaction-created' },
          { topic: 'approved' },
          { topic: 'rejected' },
        ],
        { groupId: 'yape-group', autoCommit: true, fromOffset: false },
      );

      this.consumer.on('error', (error) => {
        console.error('Error en el consumidor Kafka:', error);
      });
      this.consumer.on('offsetOutOfRange', (error) => {
        console.error('Offset fuera de rango en el consumidor Kafka:', error);
        // Puedes realizar acciones para corregir el problema de offset aquí
      });

      this.consumer.on('message', async (message: Message) => {
        console.log('Mensaje recibido:', message);
        await this.processKafkaMessage(message);
      });
    } catch (error) {
      console.error('Error al iniciar KafkaSubscriber:', error);
    }
  }

  private async processKafkaMessage(message: Message) {
    try {
      const eventData = JSON.parse(message.value.toString());
      console.log({ eventData });

      if (message.topic === 'transaction-created') {
        console.log('Manejando evento "transaction-created":', eventData);
        await this.antiFruadService.antiFraud(eventData);
      } else if (message.topic === 'approved') {
        console.log('Manejando evento "approved":', eventData);

        await this.transactionService.updateTransactionStatus(eventData);
      } else if (message.topic === 'rejected') {
        console.log('Manejando evento "transaction-created":', eventData);

        await this.transactionService.updateTransactionStatus(eventData);
      }

      //console.log(`Evento recibido en el tema ${message.topic}:`, eventData);
    } catch (error) {
      console.error('Error al procesar el evento de Kafka:', error);
    }
  }
}

// // kafka.subscriber.ts
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Consumer, Kafka, Message } from 'kafkajs';
// import { ConfigService } from '@nestjs/config';
// import { TransactionService } from 'src/transactions/transaction.service';

// @Injectable()
// export class KafkaSubscriber implements OnModuleInit {
//   private kafka: Kafka;
//   private consumer: Consumer;

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly transactionService: TransactionService,
//   ) {}

//   async onModuleInit() {
//     try {
//       console.log('Iniciando KafkaSubscriber...');
//       const kafkaHost = this.configService.get<string>('KAFKA_HOST');

//       this.kafka = new Kafka({
//         clientId: 'transaction-service',
//         brokers: [kafkaHost],
//       });

//       this.consumer = this.kafka.consumer({ groupId: 'yape-group' });

//       await this.consumer.connect();
//       console.log('Consumidor Kafka conectado.');

//       await this.consumer.subscribe({
//         topic: 'transaction-created',
//         fromBeginning: true,
//       });

//       await this.consumer.run({
//         eachMessage: async ({ topic, partition, message }) => {
//           console.log('Mensaje recibido:', {
//             topic,
//             partition,
//             offset: message.offset,
//             value: message.value.toString(),
//           });
//           await this.processKafkaMessage(message);
//         },
//       });

//       console.log('KafkaSubscriber iniciado correctamente.');
//     } catch (error) {
//       console.error('Error al iniciar KafkaSubscriber:', error);
//     }
//   }
//   private async processKafkaMessage(message: Message) {
//     try {
//       const headers = message.headers;
//       const eventData = JSON.parse(message.value.toString());

//       if (headers['topic'] === 'transaction-created') {
//         console.log('Manejando evento "transaction-created":', eventData);
//       } else if (headers['topic'] === 'approved') {
//         await this.transactionService.updateTransactionStatus(eventData);
//       } else if (headers['topic'] === 'rejected') {
//         await this.transactionService.updateTransactionStatus(eventData);
//       }

//       console.log(`Evento recibido en el tema ${headers['topic']}:`, eventData);
//     } catch (error) {
//       console.error('Error al procesar el evento de Kafka:', error);
//     }
//   }
// }
