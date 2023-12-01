import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { CreateTransactionDto } from '../infrastructure/dtos/create-transaction.dto';
import { TransactionModel } from '../domain/models/transaction.model';
import { EventBusService } from '../../shared/application/event-bus.service';
import { NewTransactionEvent } from '../domain/events/new-transaction.event';

@Injectable()
export class CreateTransactionService {
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly eventBusService: EventBusService,
  ) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionModel> {
    const transaction = TransactionModel.createFromDto(createTransactionDto);

    await this.transactionRepository.save(transaction);

    const event = NewTransactionEvent.create({
      id: transaction.id,
      value: transaction.value,
    });
    this.eventBusService.send(event);

    return transaction;
  }
}
