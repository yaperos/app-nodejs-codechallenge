import { Module } from '@nestjs/common';
import { AdaptersService } from './adapters.service';
import { KafkaClientModule } from '@app/kafka-client'
import { ConfigModule } from '@nestjs/config';
import { ApiTransactionModule } from '../../core/application/api-transaction/api-transaction.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        ConfigModule,
        KafkaClientModule,
        ApiTransactionModule,
        DatabaseModule
    ],
    providers: [
        AdaptersService
    ],
    exports: [
        AdaptersService
    ]
})
export class AdaptersModule { }
