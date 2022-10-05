import { Injectable, Logger } from '@nestjs/common';
import { Constantes } from './common/constantes';
import { AntiFraudEvent } from './dto/antifraud.event';
import { TransactionEvent } from './dto/transaction.event';

@Injectable()
export class AppService {
 
  private readonly logger = new Logger(AppService.name);

  async handleEvent(transaction: TransactionEvent) {
    var antiFraudeEvent = new AntiFraudEvent(
      transaction.transactionExternalId,
      (transaction.value > 100 ? Constantes.status_rejected : Constantes.status_approved),
      transaction.value
    );

    this.logger.log("response anti-fraud: "+ antiFraudeEvent);
    return antiFraudeEvent.toString();
  }
}
