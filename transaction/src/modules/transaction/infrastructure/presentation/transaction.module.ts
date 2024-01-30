import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppService } from '../../../../app.service';
import { DatabaseModule } from '../../../../modules/core/infrastructure/nestjs/database.module';
import { KafkaModule } from '../../../../modules/kafka/kafka.module';
import { TransactionCreatedHandler } from '../../application/events/transaction-created.handler';
import { ConsumerService } from '../../application/services/consumer';
import { TransactionApplication } from '../../application/transaction.application';
import { transactionProviders } from '../providers/transaction.provider';
import { TransactionKafkaService } from '../services/transaction-kafka.service';
import { TransactionInfrastructure } from '../transaction.infrastructure';
import { TransactionController } from './transaction.controller';
import { TransactionResolver } from './transaction.resolver';

const infrastructure = [TransactionInfrastructure, ...transactionProviders]
const application = [TransactionApplication, TransactionCreatedHandler, ConsumerService]
const controllers = [TransactionController]
@Module({
    imports: [DatabaseModule, CqrsModule, KafkaModule],
    controllers: [...controllers],
    providers: [...application, ...infrastructure, TransactionResolver, AppService, TransactionKafkaService]
})
export class TransactionModule { }