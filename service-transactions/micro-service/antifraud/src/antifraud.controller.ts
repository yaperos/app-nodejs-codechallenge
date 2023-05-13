import {Controller, Logger} from '@nestjs/common';
import {Ctx, KafkaContext, MessagePattern, Payload} from "@nestjs/microservices";
import {AntiFraudInput} from "./dto/antifraud.input";

@Controller()
export class Anti_fraudController {
  constructor() {}

  @MessagePattern('transaction_created')
  async handleAntiFraud(
      @Payload() message: AntiFraudInput,
      @Ctx() context?: KafkaContext
  ): Promise<string>{

    let status = "approved"

    if(message.value > 1000)
      status = "rejected"
    
    return JSON.stringify({...message, status})
  }
}
