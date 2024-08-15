import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionStatus } from 'src/helper/contants';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionRepository: TransactionRepository,
    private mapper: TransactionMapper,
  ) {}

  async createTransaction(dto: TransactionDTO): Promise<TransactionDTO> {
    dto.status = TransactionStatus.PENDING;
    const transaction = await this.transactionRepository.saveTransaction(dto);
    return this.mapper.entityToDto(transaction);
  }
}
