import {Controller, Logger} from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import {Ctx, KafkaContext, MessagePattern, Payload} from "@nestjs/microservices";
import {CreateTransactionInput} from "../../common/dto/create_transaction_input";
import {TransactionStatus} from "../../common/enums/transaction-status";

type AntiFraudInput = CreateTransactionInput & {
  transactionExternalId: string
}

@Controller()
export class AntiFraudController {
  constructor() {}

  @MessagePattern('transaction_created')
  async handleAntiFraud(
      @Payload() message: AntiFraudInput,
      @Ctx() context: KafkaContext
  ): Promise<any>{

    let status = TransactionStatus.APPROVED

    if(message.value > 1000)
      status = TransactionStatus.REJECTED
    
    return JSON.stringify({...message, status})
  }
}
