import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionStatus } from 'src/helper/contants';
import { TransactionResponseDto } from 'src/dtos/transaction-response.dto';
import { KafkaService } from './kafka.service';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionRepository: TransactionRepository,
    private mapper: TransactionMapper,
    private readonly kafkaService: KafkaService,
  ) {}

  async createTransaction(dto: TransactionDTO): Promise<TransactionDTO> {
    dto.status = TransactionStatus.PENDING;
    const transaction = await this.transactionRepository.saveTransaction(dto);

    this.kafkaService.sendTransactionVerify({
      transactionExternalId: transaction.transactionExternalId,
      value: transaction.value,
    });

    return this.mapper.entityToDto(transaction);
  }

  async getTransactionByExternalId(
    transactionExternalId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findById(
      transactionExternalId,
    );

    return this.mapper.entityDomainToResponse(transaction);
  }
}
