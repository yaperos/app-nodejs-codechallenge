import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionCreatedPublisher } from './publisher/transaction-created.publisher';
import { TransactionResponseMapper } from './mapper/transaction-response.mapper';
import { GENERIC_ERROR_MESSAGE } from '../constants/constants';

@Injectable()
export class TransactionService{

  private readonly logger = new Logger('TransactionService');

  constructor(
    private readonly transactionRepoitory: TransactionRepository,
    private readonly transactionCreatedPublisher: TransactionCreatedPublisher,
    private readonly transactionResponseMapper: TransactionResponseMapper
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    
    try {
      const transactionCreated = await this.transactionRepoitory.create(createTransactionDto);
      const eventResponse = await this.transactionCreatedPublisher.publish(transactionCreated);
      const updateTransactionDto = {
        ...transactionCreated,
        status: eventResponse.status.valueOf(),
        value: transactionCreated.amount
      };

      const transactionUpdated = await this.transactionRepoitory.update(updateTransactionDto);

      return this.transactionResponseMapper.toResponse(transactionUpdated);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(GENERIC_ERROR_MESSAGE);
    }
  }

  async findById(id: string) {
    
    try {
      const transaction = await this.transactionRepoitory.findById(id);

      return this.transactionResponseMapper.toResponse(transaction);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

}
