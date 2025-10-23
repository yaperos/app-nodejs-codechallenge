// kafka.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StreamingConfigurations } from 'src/utils/constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: StreamingConfigurations.STREAMING_TRANSACTION_TOKEN,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: StreamingConfigurations.CLIENT_ID,
              brokers: [configService.get<string>('streaming.brokerUrl')],
            },
            consumer: { groupId: StreamingConfigurations.GROUP_ID },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class StreamingModule {}
