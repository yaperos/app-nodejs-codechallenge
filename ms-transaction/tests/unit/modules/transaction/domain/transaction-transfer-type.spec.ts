import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import {
  TransactionTransferType,
  TransferType,
} from 'src/modules/transaction/domain/transaction-transfer-type';

import { WordMother } from '../../shared/domain/mothers';
import { TransactionTransferTypeMother } from './mothers/transaction-transfer-type.Mother';

describe('TransactionTransferType test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      TransactionTransferType.fromValue(WordMother.random());
    }).toThrow(InvalidArgumentError);
  });

  it('should test getName function', () => {
    const transferTypeNames: { [key: string]: string } = {
      [TransferType.WITHDRAWAL]: 'WITHDRAWAL',
      [TransferType.EXTERNAL]: 'EXTERNAL',
      [TransferType.INTERNAL]: 'INTERNAL',
    };

    const transactionTransferType = TransactionTransferTypeMother.random();
    expect(transactionTransferType.getName()).toEqual(
      transferTypeNames[transactionTransferType.value],
    );
  });
});
