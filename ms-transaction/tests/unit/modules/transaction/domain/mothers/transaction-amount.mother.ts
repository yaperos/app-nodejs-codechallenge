import { TransactionAmount } from 'src/modules/transaction/domain/transaction-amount';
import { FloatMother } from 'tests/unit/modules/shared/domain/mothers/float.mother';

export class TransactionAmountMother {
  static random(): TransactionAmount {
    return new TransactionAmount(this.randomValue());
  }

  static randomValue(): number {
    return FloatMother.random({ min: 1 });
  }
}
