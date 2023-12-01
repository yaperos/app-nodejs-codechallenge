import { Injectable } from '@nestjs/common';
import { ValidateTransactionDto } from '../infrastructure/dtos/validate-transaction.dto';
import { EventBusService } from '../../shared/application/event-bus.service';
import { AntifraudConstants } from '../domain/constants/antifraud.constants';
import { UpdateStatusTransactionEvent } from '../domain/events/update-status-transaction.event';
import { TransactionStatus } from '../domain/enums/transaction-status.enum';

@Injectable()
export class ValidateTransactionService {
  constructor(private eventBusService: EventBusService) {}

  async execute(data: ValidateTransactionDto): Promise<void> {
    let status: TransactionStatus;

    if (data.value <= AntifraudConstants.MAX_VALUE_TRANSACTION) {
      status = TransactionStatus.APPROVED;
    } else {
      status = TransactionStatus.REJECTED;
    }

    const event = UpdateStatusTransactionEvent.create({
      id: data.id,
      status,
    });
    this.eventBusService.send(event);
  }
}
