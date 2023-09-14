import { Inject } from '@nestjs/common';
import { ApplicationService } from '../domain/interfaces/application-service';
import { TRANSACTION_REPOSITORY } from '../infrastructure/constants/injection-tokens';
import { Transaction } from '../domain/entities/transaction';
import { ITransactionRepository } from '../domain/interfaces/transaction-repository';
import { IMessageKafkaPayload } from '../domain/interfaces/update-transactio';
import { StatusTransactions } from '../domain/enums/status.enum';

export class UpdateTransaction implements ApplicationService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  public async process(command: IMessageKafkaPayload): Promise<Transaction> {
    if (command.value > 1000) {
      command.status = StatusTransactions.REJECTED;
    } else {
      command.status = StatusTransactions.APRROVED;
    }
    await this.transactionRepository.updateTransaction(command);
    return await this.transactionRepository.findById(command.id);
  }
}
