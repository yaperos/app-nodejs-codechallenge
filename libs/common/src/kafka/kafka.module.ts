import { DynamicModule, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

interface KafkaOpstions {
  name: string;
}

@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {
  static register({ name }: KafkaOpstions): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: name,
                  brokers: [configService.get('KAFKA_URI')],
                },
                consumer: {
                  groupId: configService.get<string>(`KAFKA_${name}_CONSUMER`),
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
