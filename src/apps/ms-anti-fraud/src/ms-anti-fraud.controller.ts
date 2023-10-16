import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { AntiFraudService } from './ms-anti-fraud.service'

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('transaction_created')
  transactionReceived(payload: any) {
    console.log(`Event received ${payload.value}`)
    this.antiFraudService.processTransaction(payload.value)
  }
}
