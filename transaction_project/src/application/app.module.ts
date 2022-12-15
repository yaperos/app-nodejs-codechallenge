import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageConsumerController } from '../adapter/input/messaging/message_consumer.controller';
import { TransactionRestController } from '../adapter/input/web/transaction.rest.controller';
import { TransactionEntity } from '../domain/models/transaction.entity';
import { TransactionCreationUsecase } from '../domain/usecases/transaction_creation.usecase';
import { TransactionService } from '../adapter/out/db/transaction.service';
import { KafkaService } from 'src/adapter/input/messaging/kafka.service';
import { MessageProducerController } from 'src/adapter/input/messaging/message_producer.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [
    MessageConsumerController,
    MessageProducerController,
    TransactionRestController,
  ],
  providers: [TransactionCreationUsecase, TransactionService, KafkaService],
})
export class AppModule {}
