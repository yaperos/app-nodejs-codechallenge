import { Injectable } from '@nestjs/common';
import { getAntifraudRequest } from './get-antifraud-request.dto';

@Injectable()
export class AppService {
  private readonly transaction:any[]=[
    {
      "transactionExternalId": "67f87285-a7bd-4059-bd6b-c01b915e1cc1",
      "transactionType": {
        "name": "SEND"
      },
      "transactionStatus": {
        "name": "APPROVED"
      },
      "value": 120,
      "createdAt": "Thu Marz 08 2023 15:09:45 GMT-5"
    }
  ]
  getHello(): string {
    return 'Hello World!';
  }

  getValidateFraude(getAntifraudRequest:getAntifraudRequest){
    return this.transaction.find((transaction)=>transaction.transactionExternalId===getAntifraudRequest.transactionExternalId)
  }
}
