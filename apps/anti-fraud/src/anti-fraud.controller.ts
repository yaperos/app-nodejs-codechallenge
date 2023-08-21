import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { STATE_APPROVED, STATE_REJECTED } from './common/constant';

@Controller()
export class AntiFraudController {

  constructor(private readonly antiFraudService: AntiFraudService) { }

  @EventPattern('evaluate-transaction')
  evaluateTransaction(transaction: any) {
    Logger.log('Transaction received:::');
    Logger.log(transaction);

    let resultStateId = STATE_REJECTED;

    if (transaction?.value > 0 && transaction.value <= 1000) {
      resultStateId = STATE_APPROVED;
    }

    setTimeout(() => {
      this.antiFraudService.sendTransactionResponse({
        transactionId: transaction.transactionExternalId,
        stateId: resultStateId
      });
    }, 10000);
  }

}
