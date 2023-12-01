import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
// import { Partitioners } from 'kafkajs';

export class KafkaConfig {
  static getOptions = (configService: ConfigService): KafkaOptions => {
    return {
      transport: Transport.KAFKA,
      options: {
        // producer: { createPartitioner: Partitioners.LegacyPartitioner },
        client: {
          brokers: [
            `${configService.get<string>(
              'KAFKA_HOST',
            )}:${configService.get<string>('KAFKA_PORT')}`,
          ],
          // retry: {
          //   initialRetryTime: 1500,
          //   retries: 5,
          // },
        },
      },
    };
  };

  static ModuleName = 'KAFKA_MODULE';

  static Module = ClientsModule.registerAsync([
    {
      name: this.ModuleName,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        this.getOptions(configService),
      inject: [ConfigService],
    },
  ]);
}
