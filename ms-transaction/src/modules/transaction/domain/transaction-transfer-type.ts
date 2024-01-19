import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { EnumValueObject } from 'src/modules/shared/domain/value-object/enum-value-object';

export enum TransferType {
  WITHDRAWAL = '1',
  EXTERNAL = '2',
  INTERNAL = '3',
}

export class TransactionTransferType extends EnumValueObject<TransferType> {
  constructor(value: TransferType) {
    super(value, Object.values(TransferType));
  }

  static fromValue(value: string): TransactionTransferType {
    for (const transferTypeValue of Object.values(TransferType)) {
      if (value === transferTypeValue.toString()) {
        return new TransactionTransferType(transferTypeValue);
      }
    }

    throw new InvalidArgumentError(
      `Transaction transfer type ${value} is invalid`,
    );
  }

  getName(): string {
    return Object.keys(TransferType).find(
      (key) => TransferType[key] === this.value,
    );
  }
}
