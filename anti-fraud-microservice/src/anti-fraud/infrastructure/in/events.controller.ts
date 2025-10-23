// src/events.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudVerificiationService } from 'src/anti-fraud/application/anti-fraud-verification.service';
import { VerifyTransactionValueCommand } from 'src/anti-fraud/application/verify-transaction-value-command';
import { TransactionId } from 'src/anti-fraud/domain/TransactionId';
import {
  TransactionStatus,
  TransactionStatusEnum,
} from 'src/anti-fraud/domain/TransactionStatus';
import { TransactionValue } from 'src/anti-fraud/domain/TransactionValue';
import { TransactionCreatedDto } from 'src/anti-fraud/infrastructure/in/dto/transaction-created.dto';

@Controller()
export class EventsController {
  constructor(
    private readonly antiFraudVerificationService: AntiFraudVerificiationService,
  ) {}
  @EventPattern('transaction.pending')
  onTransactionCreated(@Payload() dto: TransactionCreatedDto) {
    this.antiFraudVerificationService.verifyAmount(
      new VerifyTransactionValueCommand(
        new TransactionId(dto.uuid),
        new TransactionStatus(
          dto.transactionStatus.name as TransactionStatusEnum,
        ),
        new TransactionValue(dto.value),
      ),
    );
  }
}
