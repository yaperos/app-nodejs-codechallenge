import { Injectable, Logger } from '@nestjs/common';
import { GetAntifraudRequest } from './requests/get-antifraud-request.dto';
import { validationResponse } from './TransactionValidation/TransactionValidator';


@Injectable()
export class AppService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(AppService.name);
  }

  getHello(): string {
    return 'Hello World!';
  }

  validateTransaction(getAntifraudRequest: GetAntifraudRequest) {
    try {
      const validation =
        validationResponse(getAntifraudRequest.accountExternalIdDebit, getAntifraudRequest.accountExternalIdCredit, getAntifraudRequest.tranferTypeId, getAntifraudRequest.value)

      const validateTransaction =
        new GetAntifraudRequest(validation.uuid, '', '', null, validation.transferType, validation.status, getAntifraudRequest.value, validation.date)

      this.logger.log(`Transaction ${validation.uuid} validated.`);

      return validateTransaction.toString()

    } catch (error) {
      this.logger.error('Error during validation', error);
    }
  }

}
