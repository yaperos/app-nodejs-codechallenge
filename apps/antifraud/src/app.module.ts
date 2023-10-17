import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkajsModule } from 'nestjs-kafkajs';
import configuration from './config/configuration';
import { TransactionsModule } from './transactions/transacions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    KafkajsModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        client: {
          clientId: configService.get('kafka.clientId'),
          brokers: configService.get('kafka.brokers'),
        },
        consumer: {
          groupId: configService.get('kafka.groupId'),
        },
      }),
      inject: [ConfigService],
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
