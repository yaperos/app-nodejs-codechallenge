import { TransactionId } from 'src/modules/transaction/domain/transaction-id';
import { UuidMother } from 'tests/unit/modules/shared/domain/mothers';

export class TransactionIdMother {
  static random(): TransactionId {
    return new TransactionId(this.randomValue());
  }

  static randomValue(): string {
    return UuidMother.random();
  }
}
