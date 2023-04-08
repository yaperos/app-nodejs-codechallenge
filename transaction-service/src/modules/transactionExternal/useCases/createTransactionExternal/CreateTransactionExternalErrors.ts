import { Result, UseCaseError } from "clean-common-lib";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CreateTransactionExternalErrors {
  export class AccountExternalDoNotExists extends Result<UseCaseError> {
    constructor(account: string) {
      super(false, {
        message: `the number account ${account} don't exists`,
      } as UseCaseError);
    }
  }

  export class InvalidTransactionExternalAmount extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `The amount of the transaction exceeds the allowed limit`,
      } as UseCaseError);
    }
  }
}
