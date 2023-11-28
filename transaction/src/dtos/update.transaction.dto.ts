import { PartialType } from '@nestjs/mapped-types';
import { TransactionDto } from './transaction.dto';

export class UpdateTransactionDto extends PartialType(TransactionDto) {}
