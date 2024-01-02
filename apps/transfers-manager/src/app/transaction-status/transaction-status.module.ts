import { Module } from '@nestjs/common';
import { TransactionStatusController } from './infrastructure/transaction-status.controller';
import { TransactionStatusService } from './application/transaction-status.service';


@Module({
    imports: [],
    controllers: [TransactionStatusController],
    providers: [TransactionStatusService],
})
export class TransactionStatusModule { }
