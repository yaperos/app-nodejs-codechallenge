import { Module } from '@nestjs/common';
import { AntiFraudSystemController } from './anti-fraud-system.controller';
import { AntiFraudSystemService } from './anti-fraud-system.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const kafkaBrokers = configService.get('kafka.brokers');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'transactions',
                brokers: kafkaBrokers,
              },
              producer: {
                allowAutoTopicCreation: true,
              },
              // consumer: {
              //   groupId: 'transactions-group',
              // },
            },
          };
        },
      },
    ]),
  ],
  controllers: [AntiFraudSystemController],
  providers: [AntiFraudSystemService],
})
export class AntiFraudSystemModule {}
