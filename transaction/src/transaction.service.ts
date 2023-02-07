import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { map, Observable } from 'rxjs';
import { Transaction } from './table/transaction.entity';
import { ResponseTransactionCreate } from './interfaces/reponseType';
import { TransactionRepository } from './repository/transaction.repository';
import { TypeTransferChange } from './enums/type-transfer-change.enum';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTI-FRAUD_SERVICE')
    protected readonly atifraudService: ClientKafka,
    private transactionRepository: TransactionRepository,
  ) {}

  async onModuleInit() {
    this.atifraudService.subscribeToResponseOf('verify');
    await this.atifraudService.connect();
  }

  async createTransaction(
    data: CreateTransactionDto,
  ): Promise<Observable<ResponseTransactionCreate[]>> {
    const transaction: Transaction = await this.transactionRepository.create(
      data,
    );
    return this.validate_transaction(transaction);
  }

  async update(transactionExternalId: string, data: CreateTransactionDto) {
    await this.transactionRepository.update(transactionExternalId, data);
  }

  validate_transaction(
    transaction: Transaction,
  ): Observable<ResponseTransactionCreate[]> {
    const pattern = 'verify';
    const payload = JSON.stringify(transaction.value);
    return this.atifraudService.send<number>(pattern, payload).pipe(
      map((res) => {
        transaction.transactionStatus = res;
        this.update(transaction.transactionExternalId, transaction);
        return this.formatResponseTransaction(res, transaction);
      }),
    );
  }

  formatResponseTransaction(
    status: number,
    transaction: Transaction,
  ): ResponseTransactionCreate[] {
    const formatResponseTransaction = {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.tranferTypeId == 1 ? TypeTransferChange.DEBIT : TypeTransferChange.CREDIT,
      },
      transactionStatus: {
        name: status == 1 ? 'Approved' : 'Rejected',
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
    return [formatResponseTransaction];
  }

  async findOnBy(transactionExternalId: string): Promise<Transaction> {
    const transaction = this.transactionRepository.findOne(
      transactionExternalId,
    );
    return transaction;
  }
}
