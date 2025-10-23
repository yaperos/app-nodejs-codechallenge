import { CustomException } from 'src/utils/custom.exception';

enum AccountExternalIdCreditErrors {
  INVALID_GUID = 'The provided Account External ID Credit is not a valid GUID.',
}
export class AccountExternalIdCredit {
  constructor(public value: string) {
    this.#validateGuid();
  }
  #validateGuid() {
    if (this.value.length != 36) {
      throw new CustomException(AccountExternalIdCreditErrors.INVALID_GUID, 400);
    }
  }
}
