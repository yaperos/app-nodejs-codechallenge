import { CustomException } from 'src/utils/custom.exception';

enum TransferTypeIdErrors {
  INVALID_GUID = 'The provided Transfer Type ID is not valid.',
}
export class TransferTypeId {
  constructor(public value: number) {
    this.#validateTransferTypeId();
  }
  #validateTransferTypeId() {
    if (this.value !== 1) {
      throw new CustomException(TransferTypeIdErrors.INVALID_GUID, 400);
    }
  }
}
