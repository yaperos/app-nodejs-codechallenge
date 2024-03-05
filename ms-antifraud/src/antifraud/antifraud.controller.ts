import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AntifraudService } from './antifraud.service';
import { TransactionDto } from './dto/transaction.dto';

@Controller('antifraud')
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) { }

  @EventPattern('transaction.created')
  async handleTransactionCreated(transaction: TransactionDto) {
    this.antifraudService.verifyAntifraud(transaction);
  }
}
