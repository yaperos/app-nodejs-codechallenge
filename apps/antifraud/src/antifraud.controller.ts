import { Controller } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @EventPattern('transaction_created')
  handleTransactionCreated(data: any) {
    this.antifraudService.handleTransactionCreated(data);
  }
}
