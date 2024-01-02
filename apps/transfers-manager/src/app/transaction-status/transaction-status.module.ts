import { Module } from '@nestjs/common';
import { TransactionStatusController } from './infrastructure/transaction-status.controller';
import { TransactionStatusService } from './application/transaction-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@yape-transactions/shared';
import { TRANSACTION_STATUS_PORT_TOKEN } from './domain/transaction-status.port';
import { TransactionStatusDbAdapter } from './infrastructure/transaction-status.db.adapter';


@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])],
    controllers: [TransactionStatusController],
    providers: [TransactionStatusService,
        {
            provide: TRANSACTION_STATUS_PORT_TOKEN,
            useClass: TransactionStatusDbAdapter
        }],
})
export class TransactionStatusModule { }
