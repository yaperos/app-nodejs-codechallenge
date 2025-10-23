import { CustomException } from 'src/utils/custom.exception';

enum AccountExternalIdDebitErrors {
  INVALID_GUID = 'The provided Account External ID Debit is not a valid GUID.',
}
export class AccountExternalIdDebit {
  constructor(public value: string) {
    this.#validateGuid();
  }
  #validateGuid() {
    if (this.value.length != 36) {
      throw new CustomException(AccountExternalIdDebitErrors.INVALID_GUID, 400);
    }
  }
}
