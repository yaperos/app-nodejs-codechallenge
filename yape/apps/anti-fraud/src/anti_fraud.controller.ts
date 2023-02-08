import {Controller, Logger} from '@nestjs/common';
import {Ctx, KafkaContext, MessagePattern, Payload} from "@nestjs/microservices";
import {TransactionStatus} from "../../common/enums/transaction-status";
import {AntiFraudInput} from "./dto/anti_fraud.input";

@Controller()
export class Anti_fraudController {
  constructor() {}

  @MessagePattern('transaction_created')
  async handleAntiFraud(
      @Payload() message: AntiFraudInput,
      @Ctx() context?: KafkaContext
  ): Promise<string>{

    let status = TransactionStatus.APPROVED

    if(message.value > 1000)
      status = TransactionStatus.REJECTED
    
    return JSON.stringify({...message, status})
  }
}
