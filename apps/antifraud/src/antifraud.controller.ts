import { Controller } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @EventPattern('transaction_created')
  transactionValidator(@Payload() data: any) {
    this.antifraudService.transactionValidator(data);
  }
}
