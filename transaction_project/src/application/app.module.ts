import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRestController } from '../adapter/input/web/transaction.rest.controller';
import { TransactionEntity } from '../domain/models/transaction.entity';
import { TransactionCreationUsecase } from '../domain/usecases/transaction_creation.usecase';
import { TransactionService } from '../adapter/output/db/transaction.service';
import { MessagingService } from 'src/adapter/input_output/messaging/messaging.service';
import { MessageProducerInitializer } from 'src/adapter/output/messaging/message_producer.initializer';
import { UpdateTransactionAfterValidationUsecase } from 'src/domain/usecases/update_transaction_after_validation.usecase';
import { MessageConsumerController } from 'src/adapter/input/messaging/message_consumer.controller';
import configurationYaml from '../../configuration.yaml';
import { FromTransactionCreationRequestDtoConverter } from 'src/adapter/input/web/converter/from_transaction_creation_request_dto.converter';
import { FromTransactionDomainConverter } from 'src/adapter/input/web/converter/from_transaction_domain.converter';
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
    MessagingService,
    FromTransactionCreationRequestDtoConverter,
    FromTransactionDomainConverter,
  ],
})
export class AppModule {}
