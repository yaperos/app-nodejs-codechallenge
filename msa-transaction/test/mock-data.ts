import { v4 as uuidv4 } from 'uuid';
import { UpdateResult } from 'typeorm';
import { UpdateTransactionDto } from 'src/modules/transaction/dto/update-transaction.dto';
import { CreateTransactionDto } from '../src/modules/transaction/dto/create-transaction.dto';
import { Transaction } from '../src/modules/transaction/entities/transaction.entity';
import { TransactionStatus } from '../src/constants/transaction.const';

export const createTransactionDto: CreateTransactionDto = {
  accountExternalIdDebit: 'b5825a95-1272-4d05-b66d-6142e0bfcdc9',
  accountExternalIdCredit: '007cbe10-ebe4-4d68-ad97-c3870106285b',
  tranferTypeId: 1,
  value: 100,
  id: '007cbe10-ebe4-4d68-ad97-c3870106285b',
};

export const responseTransaction = {
  ...createTransactionDto,
  createdAt: new Date(),
  updatedAt: new Date(),
} as CreateTransactionDto & Transaction;

export const updateTransactionDto: UpdateTransactionDto = {
  id: uuidv4(),
  status: TransactionStatus.APPROVED,
};

export const responseUpdateTransaction = {
  raw: null,
  affected: 1,
} as UpdateResult;
