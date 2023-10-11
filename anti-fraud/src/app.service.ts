import { Injectable } from '@nestjs/common';
import { GetAntifraudRequest } from './requests/get-antifraud-request.dto';


@Injectable()
export class AppService {


  getHello(): string {
    return 'Hello World!';
  }

  validateTransaction(getAntifraudRequest: GetAntifraudRequest) {

    let status: string = ''
    let limit: number = 1000

    if (getAntifraudRequest.value >= 1000) {
      status = 'rejected'
    } else {
      status = 'approved'
    }
    const validateTransaction = new GetAntifraudRequest(getAntifraudRequest.value, status)
    return validateTransaction.toString()
  }
}
