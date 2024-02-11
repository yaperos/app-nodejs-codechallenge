import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphqlModule } from './graphql/graphql.module';
import { KafkaConsumerService } from './graphql/kafka-consumer.service';
import { TransactionService } from './graphql/transaction.service';
import { Transaction } from './entities/transaction.entity';

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
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      migrations: [__dirname + '/migrations/*.{js,ts}'],
    }),
    GraphqlModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [AppController],
  providers: [AppService, TransactionService, KafkaConsumerService],
})
export class AppModule {
  constructor(private readonly kafkaConsumerService: KafkaConsumerService) {
    this.kafkaConsumerService.connect();
    this.kafkaConsumerService.run();
  }
}
