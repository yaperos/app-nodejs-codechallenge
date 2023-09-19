import { Module } from '@nestjs/common';
import { AntiFraudConsumer } from 'src/AntiFraud/AntiFraudConsumer';
import { TransactionProducer } from 'src/Transaction/TransactionProducer';
import { AntiFraudConsumerService } from './AntiFraudConsumerService';

@Module({
    providers:[AntiFraudConsumer, AntiFraudConsumerService, TransactionProducer],
    exports:[ AntiFraudConsumer, AntiFraudConsumerService]
})
export class AntiFraudModule {}