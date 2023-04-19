import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { KafkaClient } from './kafka-client.service';
import { Kafka } from 'kafkajs'; 

@Module({
  imports: [],
  providers: [
    AntiFraudService,
    // KafkaClient como un serv inyectable
    {
      provide: 'KAFKA_CLIENT',
      useClass: KafkaClient,
    },
    // Kafka con una factoría
    {
      provide: 'KAFKA_SERVICE',
      useFactory: () => {
        // Configuración
        return new Kafka({
          clientId: 'transaction', // Cliente
          brokers: ['kafka:29092'], // Dirección del broker
          connectionTimeout: 10000, // Timeout
        });
      },
    },
  ],
})
export class AntiFraudModule {}
