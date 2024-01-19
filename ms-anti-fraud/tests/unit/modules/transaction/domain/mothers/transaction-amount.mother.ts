import { FloatMother } from 'tests/unit/modules/shared/domain/mothers/float.mother';

export class TransactionAmountMother {
  static randomValue(): number {
    return FloatMother.random({ min: 1 });
  }
}
