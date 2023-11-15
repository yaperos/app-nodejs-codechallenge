import { join } from 'path';

import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { TransactionModule } from './transactions/transaction.module';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaSubscriber } from './kafka/kafka.subscriber';
import { KafkaAdminService } from './kafka/kafka-admin.service';
import { AntiFraudModule } from './antiFraud/antiFraud.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    //TODO: crear un archivo config para
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    TransactionModule,
    KafkaModule,
    AntiFraudModule,
  ],
  controllers: [],
  providers: [KafkaAdminService, KafkaSubscriber],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly kafkaAdminService: KafkaAdminService) {}

  async onApplicationBootstrap() {
    try {
      // Crea los topics necesarios al inicio de la aplicación
      await this.kafkaAdminService.createTopics([
        'transaction-created',
        'approved',
        'rejected',
      ]);
      console.log('Topics created successfully');
    } catch (error) {
      console.error('error when creating topics', error);
    }
  }
}
