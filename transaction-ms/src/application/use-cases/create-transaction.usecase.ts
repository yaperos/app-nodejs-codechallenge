import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { KafkaProducer } from 'src/infrastructure/kafka/kafka.producer';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';



@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  async execute(dto: CreateTransactionDTO): Promise<TransactionEntity> {
    const newTransaction: TransactionEntity = {
      transactionExternalId: '',
      accountExternalIdDebit: dto.accountExternalIdDebit,
      accountExternalIdCredit: dto.accountExternalIdCredit,
      transferTypeId: dto.transferTypeId,
      value: dto.value,
      transactionStatus: 'PENDING',
      createdAt: new Date(),
    };

    // Guardar en DynamoDB
    const savedTransaction = await this.transactionRepository.save(newTransaction);

    // Emitir evento "TransactionCreated" en Kafka
    await this.kafkaProducer.send('transaction-created-topic', {
      transactionExternalId: savedTransaction.transactionExternalId,
      accountExternalIdDebit: savedTransaction.accountExternalIdDebit,
      accountExternalIdCredit: savedTransaction.accountExternalIdCredit,
      transferTypeId: savedTransaction.transferTypeId,
      value: savedTransaction.value,
      transactionStatus: savedTransaction.transactionStatus,
      createdAt: savedTransaction.createdAt,
    });

    return savedTransaction;
  }
}
