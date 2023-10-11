import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { GetAntifraudRequest } from './requests/get-antifraud-request.dto';

@Injectable()
export class AppService {
  private logger: Logger;

  constructor(@Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka) {
    this.logger = new Logger(AppService.name);

  }
  getHello(): string {
    return 'Hello World!';
  }



  handleTransactionCreated({ accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value }: TransactionCreatedEvent) {

    const validateTransaction = new GetAntifraudRequest(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value)
    this.antifraudClient
      .send('validate-transaction', validateTransaction.toString())
      .subscribe((response) => {
        try {
          this.handleValidationSuccess(response);
        }
        catch (error) {
          this.handleValidationError(error);
        }
      })
  }

  private handleValidationSuccess(response) {
    this.logger.log('Transaction validated.', response);
  }

  private handleValidationError(error) {
    this.logger.error('Error during Transaction', error);
  }
}
