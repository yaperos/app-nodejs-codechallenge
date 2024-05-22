import { Module } from '@nestjs/common';
import { AntifraudService } from './autifraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import enviromentConfig from './config/enviroment.config';
import { KAFKA_NAME_SERVICE } from './constants/kafka.constants';

@Module({
  imports: [
    ConfigModule.forFeature(enviromentConfig),
    ClientsModule.registerAsync([
      {
        name: KAFKA_NAME_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>(
                'KAFKA_CLIENT_ID',
                'app-gateway'
              ),
              brokers: configService
                .get<string>('KAFKA_BROKERS', 'localhost:9092')
                .split(','),
            },
            consumer: {
              groupId: configService.get<string>(
                'KAFKA_CONSUMER_GROUP_ID',
                'kafka-microservices'
              ),
            },
          },
        }),
      },
    ]),
  ],
  controllers: [],
  providers: [AntifraudService],
  exports: [AntifraudService],
})
export class AntifraudLibModule {}
