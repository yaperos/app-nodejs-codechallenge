import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { TransactionStatuses } from '../types/transaction-types-enums';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
    transactionStatus: TransactionStatuses;
}
