import { UuidMother } from 'tests/unit/modules/shared/domain/mothers';

export class TransactionIdMother {
  static randomValue(): string {
    return UuidMother.random();
  }
}
