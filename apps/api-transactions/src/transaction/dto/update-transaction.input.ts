import { PartialType } from '@nestjs/mapped-types';
import { Transaction } from '../entities/transaction.entity';

export class UpdateTransactionDto extends PartialType(Transaction) {}
