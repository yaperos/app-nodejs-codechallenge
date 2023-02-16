import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';
import { TransactionStatusModule } from 'src/transaction-status/transaction-status.module';
import { TransactionTypeModule } from 'src/transaction-type/transaction-type.module';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { CreateProducer} from 'src/kafka/create.producer';
import { KafkaModule } from 'src/kafka/kafka.module';


@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), TransactionStatusModule, TransactionTypeModule, KafkaModule],
    providers:[TransactionService, TransactionResolver, ProducerService, CreateProducer],
    exports: [TransactionService],
    controllers: [TransactionController]
})
export class TransactionModule {}
