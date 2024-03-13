import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionInterface } from '../../../domain/transaction/transaction.model';
import { msConfig } from '../../../infraestructure/config';
import { AntiFraudService } from './antiFraud.service';
import { TransactionService } from '../transaction/transaction.service';

@Controller()
export class AntiFraudController {
  constructor(
    private readonly antiFraudService: AntiFraudService,
    private readonly transctionService: TransactionService,
  ) {}

  @EventPattern(`${msConfig.nameAntiFraud}-created-transaction`)
  verifyTransaction(@Payload(ValidationPipe) data: TransactionInterface) {
    const trx = data;
    this.antiFraudService.verifyTransaction(trx);
    this.transctionService.updateTransaction(trx);
  }
}
