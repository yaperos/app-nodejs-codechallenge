import { Inject, Injectable } from '@nestjs/common';
import { RequestData, TransactionEvent } from '@app/common/interfaces';
import { Status, TRANSACTION_VALIDATED } from '@app/common/constants';
import { Token } from '../../infrastructure/constants';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject(Token.TRANSACTION_CLIENT) private transactionSender: ClientKafka,
    private configService: ConfigService,
  ) {}

  async verifyTransaction(event: TransactionEvent): Promise<TransactionEvent> {
    // TODO: Bussiness logical of the account, it depends transaction type
    const status =
      event.amount > Number(this.configService.get<number>('limitAmount'))
        ? Status.REJECTED
        : Status.APPROVED;

    return {
      ...event,
      status,
    };
  }

  async emitValidatedTransactionNotification(event: TransactionEvent) {
    await lastValueFrom(
      this.transactionSender.emit<string, RequestData<TransactionEvent>>(
        TRANSACTION_VALIDATED,
        {
          payload: {
            ...event,
            sent: new Date(),
          },
        },
      ),
    );
  }
}
