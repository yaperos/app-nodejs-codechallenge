import { TransactionAccountExternalId } from 'src/modules/transaction/domain/transaction-account-external-id';
import { UuidMother } from 'tests/unit/modules/shared/domain/mothers';

export class TransactionAccountExternalIdMother {
  static random(): TransactionAccountExternalId {
    return new TransactionAccountExternalId(this.randomValue());
  }

  static randomValue(): string {
    return UuidMother.random();
  }
}
