import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  MAX_VALUE,
  STATUS_APPROVED,
  STATUS_REJECT,
  TRANSACTION_CLIENT,
} from './constants';
import { Observable } from 'rxjs';
import { CHANGE_STATUS_TRANSACTION_MESSAGE_PATTERN } from 'utils/utils/constants-global';

@Injectable()
export class AntiFraudMsService {
  constructor(
    @Inject(TRANSACTION_CLIENT)
    private readonly emitEvent: ClientKafka,
  ) {}

  validate(payload): Observable<any> {
    return payload.value > MAX_VALUE
      ? this.emitEvent.emit(
          CHANGE_STATUS_TRANSACTION_MESSAGE_PATTERN,
          JSON.stringify({
            accountExternalId: payload.accountExternalId,
            transactionStatus: STATUS_REJECT,
          }),
        )
      : this.emitEvent.emit(
          CHANGE_STATUS_TRANSACTION_MESSAGE_PATTERN,
          JSON.stringify({
            accountExternalId: payload.accountExternalId,
            transactionStatus: STATUS_APPROVED,
          }),
        );
  }
}
