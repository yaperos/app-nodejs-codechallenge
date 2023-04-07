import { Result, UseCaseError } from 'clean-common-lib';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UpdateTransactionExternalErrors {
  export class AccountExternalDoNotExists extends Result<UseCaseError> {
    constructor(account: string) {
      super(false, {
        message: `the number account ${account} don't exists`,
      } as UseCaseError);
    }
  }
}
