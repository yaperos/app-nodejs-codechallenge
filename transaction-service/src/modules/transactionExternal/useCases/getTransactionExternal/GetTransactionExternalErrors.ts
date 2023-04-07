import { Result, UseCaseError } from 'clean-common-lib';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GetTransactionExternalErrors {
  export class TransactionExternalDoNotExists extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `the transaction external ${id} don't exists`,
      } as UseCaseError);
    }
  }
}
