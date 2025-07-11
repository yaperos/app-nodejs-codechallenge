import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>(
                'app.kafka.clientId',
                'fraud-detection',
              ),
              brokers: configService.get<string[]>('app.kafka.brokers', [
                'localhost:9092',
              ]),
            },
            consumer: {
              groupId: configService.get<string>(
                'app.kafka.groupId',
                'fraud-detection-group',
              ),
              allowAutoTopicCreation: true,
            },
            producer: {
              allowAutoTopicCreation: true,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
