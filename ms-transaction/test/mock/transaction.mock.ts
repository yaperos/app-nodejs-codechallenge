import { TransactionEntity } from '../../src/domain/entities/transaction.entity';
import {
  TransferStatus,
  TransferType,
} from '../../src/domain/interfaces/transaction.interface';

export const mockTransaction = {
  amount: 100,
  externalId: '9f754146-902c-4a32-9b94-3caa4e22ab57',
  accountExternalName: 'John Doe',
  transferTypeName: TransferType.DEBIT,
  status: TransferStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: 1,
  toResponse: function (): {
    id: number;
    externalId: string;
    amount: number;
    transferTypeName: TransferType;
    status: TransferStatus;
    createdAt: Date;
    updatedAt: Date;
  } {
    throw new Error('Function not implemented.');
  },
} as unknown as TransactionEntity;

export const mockTransactionDto = {
  amount: 100,
  externalId: '9f754146-902c-4a32-9b94-3caa4e22ab57',
  accountExternalName: 'John Doe',
  transferTypeName: TransferType.DEBIT,
  status: TransferStatus.PENDING,
  createdAt: new Date(),
};

export const mockSaveTransaction = {
  amount: 100,
  accountExternalName: 'John Doe',
  transferTypeName: TransferType.DEBIT,
};
