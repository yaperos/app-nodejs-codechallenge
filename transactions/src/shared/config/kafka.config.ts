import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const kafkaConfig = ClientsModule.registerAsync([
  {
    name: 'ANTIFRAUD_SERVICE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      name: 'ANTIFRAUD_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'antifraud',
          brokers: [configService.get('KAFKA_BROKER')],
        },
        consumer: {
          groupId: 'antifraud-consumer',
        },
      },
    }),
  },
]);
