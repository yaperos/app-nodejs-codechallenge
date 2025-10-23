import { Module, Global } from '@nestjs/common';
import { TypeOrmInfraModule } from './config/database/typeorm.module';
import { TransactionModule } from './database/transactions/transactions.module';
import { KafkaInfraModule } from './config/messaging/kafka.module';
import { MessagingModule } from './messaging/messaging.module';

@Global()
@Module({
    imports: [        
        TypeOrmInfraModule,
        TransactionModule,
        KafkaInfraModule,
        MessagingModule
    ],
    exports: [
        TransactionModule,
        KafkaInfraModule,
        MessagingModule
    ]
})
export class InfrastructureModule { }

