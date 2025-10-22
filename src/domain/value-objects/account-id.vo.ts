export class AccountId {
  constructor(public readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('AccountId cannot be empty');
    }

    const phoneRegex = /^\+?[1-9]\d{8,14}$/;
    const accountIdRegex = /^[A-Z0-9]{8,20}$/;

    if (!phoneRegex.test(this.value) && !accountIdRegex.test(this.value)) {
      throw new Error('Invalid AccountId format');
    }
  }

  equals(accountId: AccountId): boolean {
    return this.value === accountId.value;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}