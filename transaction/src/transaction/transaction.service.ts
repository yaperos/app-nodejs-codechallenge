import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entity/transaction.entity';
import { TransactionStatus } from './enum/transaction-status.enum';
import { ITransaction } from './interface/transaction.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject('ANTI_FRAUD_SERVICE') private readonly antiFraudClient: ClientKafka,
  ) {}

  async listTransactions(): Promise<ITransaction[]> {
    const transactions: Transaction[] = await this.transactionRepository.find({
      select: ['id', 'status', 'value', 'createdAt', 'tranferTypeId'],
    });

    const transactionList = transactions.map((transaction: Transaction) => ({
      transactionExternalId: transaction.id,
      transactionType: { name: transaction.tranferTypeId },
      transactionStatus: { name: transaction.status },
      value: transaction.value,
      createdAt: transaction.createdAt,
    }));

    return transactionList;
  }

  async createTransaction(body: CreateTransactionDto): Promise<void> {
    const transaction = new Transaction();
    transaction.id = uuid();
    transaction.status = TransactionStatus.PENDING;
    transaction.tranferTypeId = body.tranferTypeId;
    transaction.value = body.value;
    transaction.accountExternalIdCredit = body.accountExternalIdCredit;
    transaction.accountExternalIdDebit = body.accountExternalIdDebit;
    transaction.createdAt = new Date();

    await this.transactionRepository.save(transaction);

    this.antiFraudClient
      .send('validate_transaction', JSON.stringify(transaction))
      .subscribe({
        next: (transactionStatus: number) => {
          this.updateTransactionStatus(transaction.id, transactionStatus);
        },
        error: (err) => Logger.error(`An error has ocurred: ${err}`),
      });
  }

  async updateTransactionStatus(
    transactionId: string,
    transactionStatus: number,
  ): Promise<void> {
    await this.transactionRepository.update(
      {
        id: transactionId,
      },
      {
        status: transactionStatus,
      },
    );
  }
}
