import { Module } from '@nestjs/common';
import { AntiFraudModule } from 'src/AntiFraud/AntiFraud.module';
import { AntiFraudConsumer } from 'src/AntiFraud/AntiFraudConsumer';
import { TransactionModule } from 'src/Transaction/Transaction.module';
import { TransactionConsumer } from 'src/Transaction/TransactionConsumer';
//import { AntiFraudConsumer } from 'src/AntiFraud/AntiFraudConsumer';
// import { TransactionConsumer } from 'src/Transaction/TransactionConsumer';
// import { TransactionProducer } from 'src/Transaction/TransactionProducer';
// import { TransactionEntity } from 'src/entities/transaction.entity';
// import { TransactionService } from 'src/services/transaction.service';

@Module({
    imports: [
        //TypeOrmModule.forFeature([TransactionEntity])
        //, 
        AntiFraudModule
        ,TransactionModule
    ],
    providers:[AntiFraudConsumer, TransactionConsumer],
    // exports:[TransactionProducer, TransactionConsumer, AntiFraudConsumer, TransactionService]
    // providers:[TransactionProducer, TransactionConsumer, TransactionService],
    // exports:[TransactionProducer, TransactionConsumer, TransactionService]    
})
export class KafkaModule {}
