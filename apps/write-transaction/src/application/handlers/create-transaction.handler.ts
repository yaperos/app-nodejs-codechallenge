import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientKafka } from '@nestjs/microservices';
import { MessageBrokerDto } from 'apps/shared/message-broker.dto';
import { plainToInstance } from 'class-transformer';
import { TransactionModel } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateTransactionCommand } from "../commands/create-transaction.command";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {

  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository,
    @Inject('KAFKA_CLIENT') private readonly clientKafka: ClientKafka) { }

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('transaction.created');
    await this.clientKafka.connect();
  }

  async execute(command: CreateTransactionCommand): Promise<TransactionModel> {
    try {
      const transactionCreated = await this.transactionRepository.save(command.createTransactionDto);
      const transactionModelInstance = plainToInstance(TransactionModel, transactionCreated)
      this.clientKafka.emit('transaction.created', this.buildMessageInput(transactionModelInstance));
      return transactionCreated;
    } catch (error) {
      Logger.error('Error al procesar la transacción', error);
      throw error;
    }
  }

  private buildMessageInput(transactionCreated: TransactionModel): MessageBrokerDto<TransactionModel> {
    return {
      type: 'transaction_created',
      date: new Date(),
      content: transactionCreated,
    };
  }
}