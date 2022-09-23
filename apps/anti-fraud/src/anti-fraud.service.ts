import { END_TRANSACTION_VALIDATED } from '@app/common/constans/topics';
import { RequestData, AntiFraud } from '@app/common/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TRANSACTION_STATUS, TRANSACTION_SERVICE } from './constans';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject(TRANSACTION_SERVICE) private transactionClient: ClientKafka,
  ) {}

  async check(data: AntiFraud) {
    let validData: AntiFraud = {
      transactionId: data.transactionId,
      status: data.status,
      value: data.value,
    };
    if (data.value <= 1000 && data.value > 0) {
      validData.status = TRANSACTION_STATUS.APPROVED;
    } else {
      validData.status = TRANSACTION_STATUS.REJECTED;
    }
    return validData;
  }

  async emitResultValidated(data: AntiFraud) {
    await lastValueFrom(
      this.transactionClient.emit<string, RequestData<AntiFraud>>(
        END_TRANSACTION_VALIDATED,
        {
          payload: data,
        },
      ),
    );
  }
}
