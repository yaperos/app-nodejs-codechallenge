import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../entities/transaction.entity';
import { randomUUID } from 'crypto';
import { KafkaPublisher } from '../../infrastructure/kafka/kafka-publisher';

export interface CreateTransactionDTO {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export class CreateTransactionUseCase {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly kafkaPublisher: KafkaPublisher,
  ) {}

  async execute(dto: CreateTransactionDTO) {
    const status = dto.value > 1000 ? 'rejected' : 'pending';

    const transaction = new Transaction(
      randomUUID(),
      dto.accountExternalIdDebit,
      dto.accountExternalIdCredit,
      dto.tranferTypeId,
      dto.value,
      status,
      new Date(),
    );

    await this.repository.save(transaction);

    // Emitir evento a Kafka
    await this.kafkaPublisher.publish('transaction.created', {
      id: transaction.id,
      value: transaction.value,
      status: transaction.status,
    });

    return transaction;
  }
}