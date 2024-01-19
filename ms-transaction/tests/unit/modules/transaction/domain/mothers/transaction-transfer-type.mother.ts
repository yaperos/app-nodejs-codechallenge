import {
  TransactionTransferType,
  TransferType,
} from 'src/modules/transaction/domain/transaction-transfer-type';

import { EnumMother } from '../../../shared/domain/mothers';

export class TransactionTransferTypeMother {
  static random(): TransactionTransferType {
    return new TransactionTransferType(this.randomValue());
  }

  static randomValue(): TransferType {
    return EnumMother.random(TransferType);
  }
}
