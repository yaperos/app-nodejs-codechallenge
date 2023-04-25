import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AntifraudServiceController } from './antifraud-service.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntifraudServiceService } from './antifraud-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/antifraud-service/.env'
    }),
    ClientsModule.registerAsync([
      {
        name: "VALIDATE_SERVICE",
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: config.get('KAFKA_CLIENT_ID'),
              brokers: config.get('KAFKA_BROKERS').split(','),
            }
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [AntifraudServiceController],
  providers: [AntifraudServiceService],
})
export class AntifraudServiceModule { }
