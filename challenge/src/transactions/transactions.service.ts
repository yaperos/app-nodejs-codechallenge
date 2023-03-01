import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewTransactionDto } from 'src/shared/dtos/NewTransaction.dto';
import { TransactionStatusEnum } from 'src/shared/enums/transaction-status.enum';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

export interface FindAllFilter {
  transactionStatus?: TransactionStatusEnum;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private usersRepository: Repository<Transaction>,
  ) {}

  async findOne(transactionExternalId: string): Promise<Transaction | null> {
    return await this.usersRepository.findOneBy({ transactionExternalId });
  }

  async create(transactionDto: NewTransactionDto): Promise<Transaction> {
    const transaction = new Transaction();

    transaction.accountExternalIdDebit = transactionDto.accountExternalIdDebit;
    transaction.accountExternalIdCredit =
      transactionDto.accountExternalIdCredit;
    transaction.transactionType = transactionDto.tranferTypeId;
    transaction.value = transactionDto.value;

    return await this.usersRepository.save(transaction);
  }

  async updateStatus(
    transactionExternalId: string,
    transactionStatus: TransactionStatusEnum,
  ) {
    this.logger.log(
      `changing transaction ${transactionExternalId} status to ${transactionStatus}`,
    );

    return await this.usersRepository.update(
      { transactionExternalId },
      { transactionStatus },
    );
  }

  async findAll({ transactionStatus }: FindAllFilter = {}): Promise<
    Transaction[]
  > {
    return this.usersRepository.findBy({ transactionStatus });
  }
}
