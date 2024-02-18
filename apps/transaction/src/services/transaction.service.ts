import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { map, Observable } from 'rxjs';
import { Transaction } from '../entities/transaction.entity';
import { TransactionResponse } from '../interfaces/transaction';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTI-FRAUD_SERVICE')
    protected readonly atifraudService: ClientKafka,
    private transactionRepository: TransactionRepository
  ) {}

  async onModuleInit() {
    this.atifraudService.subscribeToResponseOf('validate');
    await this.atifraudService.connect();
  }

  formatTransactionResponse(status: number, transaction: Transaction): TransactionResponse[] {
    const response = {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.tranferTypeId == 1 ? 'Debit' : 'Credit',
      },
      transactionStatus: {
        name: status == 1 ? 'Approved' : 'Rejected',
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };

    return [response];
  }

  async updateTransaction(transactionExternalId: string, data: CreateTransactionDto) {
    await this.transactionRepository.update(transactionExternalId, data);
  }

  validateTransaction(transaction: Transaction): Observable<TransactionResponse[]> {
    const pattern = 'validate';
    const payload = JSON.stringify(transaction.value);

    return this.atifraudService.send<number>(pattern, payload).pipe(
      map(status => {
        transaction.transactionStatus = status;
        this.updateTransaction(transaction.transactionExternalId, transaction);

        return this.formatTransactionResponse(status, transaction);
      })
    );
  }

  async createTransaction(data: CreateTransactionDto): Promise<Observable<TransactionResponse[]>> {
    const transaction: Transaction = await this.transactionRepository.create(data);

    return this.validateTransaction(transaction);
  }
}
