import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRestController } from '../adapter/input/web/transaction.rest.controller';
import { TransactionEntity } from '../domain/models/transaction.entity';
import { TransactionCreationUsecase } from '../domain/usecases/transaction_creation.usecase';
import { TransactionService } from '../adapter/output/db/transaction.service';
import { KafkaService } from 'src/adapter/input/messaging/kafka.service';
import { MessageProducerInitializer } from 'src/adapter/input/messaging/message_producer.initializer';
import { UpdateTransactionAfterValidationUsecase } from 'src/domain/usecases/update_transaction_after_validation.usecase';
import { MessageConsumerController } from 'src/adapter/input/messaging/message_consumer.controller';
import configurationYaml from '../../configuration.yaml';
import { ToTransactionDomainConverter } from 'src/adapter/input/web/converter/to_transaction_domain.converter';
@Module({
  imports: [
    ConfigModule.forRoot({ load: [configurationYaml] }),
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
    MessageProducerInitializer,
    TransactionRestController,
  ],
  providers: [
    TransactionCreationUsecase,
    UpdateTransactionAfterValidationUsecase,
    TransactionService,
    KafkaService,
    ToTransactionDomainConverter,
  ],
})
export class AppModule {}
