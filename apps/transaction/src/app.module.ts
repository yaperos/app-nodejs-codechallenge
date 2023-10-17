import { CacheModule, Module } from '@nestjs/common';
import { ExternalTransactionsModule } from './external-transactions/external-transactions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkajsModule } from 'nestjs-kafkajs';
import configuration from './config/configuration';

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
    CacheModule.register({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('db'),
      inject: [ConfigService],
    }),
    ExternalTransactionsModule,
  ],
})
export class AppModule {}
