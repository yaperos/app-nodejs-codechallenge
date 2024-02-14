import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesController } from './pages/controllers/pages.controller';
import { PagesService } from './pages/services/pages.service';
import { GraphqlModule } from './graphql/graphql.module';
import { Transaction } from './common/entities/transaction.entity';
import { KafkaConsumerService } from './kafka/services/kafka-consumer.service';
import { TransactionService } from './transactions/services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/common/entities/*.entity.{js,ts}'],
      migrations: [__dirname + '/database/migrations/*.{js,ts}'],
    }),
    GraphqlModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [PagesController],
  providers: [PagesService, TransactionService, KafkaConsumerService],
})
export class AppModule {
  constructor(private readonly kafkaConsumerService: KafkaConsumerService) {
    this.kafkaConsumerService.connect();
    this.kafkaConsumerService.run();
  }
}
