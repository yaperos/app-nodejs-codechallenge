import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventBusService } from '../../application/event-bus.service';
import { EventBusConstants } from '../../domain/constants/event-bus.constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EventBusConstants.NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            name: EventBusConstants.NAME,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get('KAKFA_CLIENT_ID'),
                brokers: [configService.get('KAFKA_BROKER')],
              },
              consumer: {
                groupId: configService.get('KAFKA_CONSUMER_SEND_GROUP_ID'),
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {}
