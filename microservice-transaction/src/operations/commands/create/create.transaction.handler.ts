import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionCommand } from './create.transaction.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand, Transaction>
{
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject('TRANSACTION_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<Transaction> {
    const entity = this.classMapper.map(command, CreateTransactionCommand, Transaction);
    const transaction = await this.transactionRepository.save(entity);

    this.kafkaService.emit(
      'transaction-created',
      JSON.stringify({
        transactionExternalId: transaction.transactionExternalId,
        value: transaction.value,
      }),
    );

    return transaction;
  }
}
