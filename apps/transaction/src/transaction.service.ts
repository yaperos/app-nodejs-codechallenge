import { Transaction } from '@app/database/entities/transaction';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';

@Injectable()
export class TransactionService {
  @Inject()
  private readonly configService: ConfigService;

  @InjectRepository(Transaction)
  private readonly transactionRepository: Repository<Transaction>;

  async createTransaction(data: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.value = data.value;
    const createdTransaction =
      await this.transactionRepository.save(transaction);

    const dto = new GetTransactionDto();
    dto.id = createdTransaction.id;
    dto.value = createdTransaction.value;
    dto.status = createdTransaction.status;
    dto.createdAt = createdTransaction.createdAt;
    dto.updatedAt = createdTransaction.updatedAt;
    return dto;
  }

  async getTransactionById(id: string): Promise<GetTransactionDto> {
    const options: FindOptionsWhere<Transaction> = { id };
    const transaction = await this.transactionRepository.findOneBy(options);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    const dto = new GetTransactionDto();
    dto.id = transaction.id;
    dto.value = transaction.value;
    dto.status = transaction.status;
    dto.createdAt = transaction.createdAt;
    dto.updatedAt = transaction.updatedAt;
    return dto;
  }
}
