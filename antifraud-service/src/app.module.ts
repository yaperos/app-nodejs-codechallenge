import { Module } from '@nestjs/common';
import { AntifraudController } from './infrastructure/antifraud.controller';
import { ConfigModule } from '@nestjs/config';
import { AntifraudService } from './application/antifraud.service';
import { KafkaService } from './infrastructure/kafka.service';
import { PubsubInterface } from './domain/pubsub.interface';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'ANTIFRAUD_SERVICE',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
            },
            consumer: {
              groupId: process.env.KAFKA_GROUP_ID,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AntifraudController],
  providers: [
    AntifraudService,
    {
      provide: PubsubInterface,
      useClass: KafkaService,
    },
  ],
})
export class AppModule {}
