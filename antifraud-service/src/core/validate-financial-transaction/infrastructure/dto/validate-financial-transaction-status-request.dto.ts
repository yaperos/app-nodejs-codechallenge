export class ValidateFinancialTransactionRequestDTO {
  readonly id: StringValueObject;
  readonly accountDebit: Account;
  readonly accountCredit: Account;
  readonly value: NumberValueObject;
  readonly type: EnumValueObject;
  readonly status: EnumValueObject;
  readonly createdAt: StringValueObject;
}

export class Account {
  readonly id: StringValueObject;
}

export class StringValueObject {
  readonly value: string;
}

export class EnumValueObject {
  readonly validValues: string[];
  readonly value: string;
}

export class NumberValueObject {
  readonly value: number;
}
