import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { ClientKafka } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import {
  StatusType,
  TransactionRegisterDto,
  TransactionValidDto,
  UpdateTransactionDto,
  VALID_TRANSACTION_TOPIC,
} from '@app/common';
import {
  TransactionResponseDto,
  TransactionSearchRequestDto,
  TransactionSearchResponseDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('ANTIFRAUD_KAFKA_CLIENT') private readonly client: ClientKafka,
  ) {}

  async registerTransaction(
    transactionRegisterDto: TransactionRegisterDto,
  ): Promise<TransactionResponseDto> {
    transactionRegisterDto.transactionStatusId = StatusType.pending;
    transactionRegisterDto.transactionExternalId = uuidv4();
    const registerTransact = await this.transactionRepository.saveTransaction(
      transactionRegisterDto,
    );

    const transactionValid: TransactionValidDto = {
      id: registerTransact.id,
      value: registerTransact.value,
    };

    this.client.emit(VALID_TRANSACTION_TOPIC, JSON.stringify(transactionValid));
    return registerTransact;
  }

  async updateTransaction(
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const findTransaction =
      await this.transactionRepository.findTransactionById(
        updateTransactionDto.id,
      );

    if (!findTransaction) {
      throw new NotFoundException(`transaction not found`);
    }

    return this.transactionRepository.updateTransaction({
      ...findTransaction,
      transactionStatusId: updateTransactionDto.transactionStatusId,
    });
  }

  async searchTransactions(
    transactionSearchRequestDto: TransactionSearchRequestDto,
  ): Promise<TransactionSearchResponseDto[]> {
    return await this.transactionRepository.searchTransactions(
      transactionSearchRequestDto,
    );
  }
}
