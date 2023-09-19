import { Module } from '@nestjs/common';
import { TransactionProducer } from 'src/Transaction/TransactionProducer';
import { TransactionConsumer } from 'src/Transaction/TransactionConsumer';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { TransactionService } from 'src/services/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionConsumerService } from './TransactionConsumerService';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity])
    ],    
    providers:[TransactionProducer, TransactionConsumer, TransactionService,TransactionConsumerService],
    exports:[TransactionProducer, TransactionConsumer, TransactionService]      
})
export class TransactionModule {}