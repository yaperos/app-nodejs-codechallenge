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
import { CommonModule } from './common/common.module';
import { Topics } from './common/types/topicsNames';
import { enviroment } from './common/confiig';

@Module({
  imports: [
    ConfigModule.forRoot(),

    //TODO: crear un archivo config para
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: enviroment.DB_HOST,
      port: enviroment.DB_PORT,
      database: enviroment.DB_NAME,
      username: enviroment.DB_USERNAME,
      password: enviroment.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    TransactionModule,
    KafkaModule,
    AntiFraudModule,
    CommonModule,
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
        Topics.TRANSACTION_CREATED,
        Topics.APPROVED,
        Topics.REJECTED,
      ]);
      console.log('Topics created successfully');
    } catch (error) {
      console.error('error when creating topics', error);
    }
  }
}
