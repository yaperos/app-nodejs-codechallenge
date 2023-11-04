import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const KafkaProvider = ClientsModule.registerAsync([
  {
    imports: [ConfigModule],
    name: 'KAFKA_CLIENT',
    useFactory: async (configService: ConfigService) => {
      return {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [configService.get<string>('KAFKA_BROKER')],
          },
          consumer: {
            groupId: configService.get<string>('KAFKA_GROUP_ID'),
          },
        },
      };
    },
    inject: [ConfigService],
  },
]);
