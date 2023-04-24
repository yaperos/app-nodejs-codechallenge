import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction';
import { ClientKafka } from '@nestjs/microservices';
import {
  IRegisterTransaction,
  Transaction,
} from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EVENT_TRANSACTION_VALIDATE } from '../constants';
import { TRANSACTION_STATUS } from './interfaces/transaction.status.interface';
import { TRANSACTION_TYPE } from './interfaces/transaction.tranfer.interface';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTI_FRAUD_PACKAGE') private clientKafka: ClientKafka,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getTransaction(uuid: string) {
    Logger.log(`getTransaction: ${JSON.stringify({ uuid })}`);
    const response = await this.transactionRepository.findOne({
      where: { uuid },
    });
    if (!response) {
      return {
        transactionExternalId: uuid,
        transactionType: null,
        transactionStatus: null,
        value: null,
        createdAt: null,
        error: 'Transaction not found',
      };
    }
    return {
      transactionExternalId: uuid,
      transactionType: {
        name:
          response.tranfer_type === TRANSACTION_TYPE.IMMEDIATE
            ? 'immediate'
            : 'scheduled',
      },
      transactionStatus: {
        name: response.status,
      },
      value: response.value,
      createdAt: response.created_at.toISOString(),
      error: null,
    };
  }

  async createTransaction(createTransaction: CreateTransactionDto) {
    Logger.log(`createTransaction: ${JSON.stringify(createTransaction)}`);

    const tranfer_type =
      createTransaction.tranferTypeId === 2
        ? TRANSACTION_TYPE.IMMEDIATE
        : TRANSACTION_TYPE.SCHEDULED;
    const newTransaction: IRegisterTransaction = {
      accountexternal_id_debit: createTransaction.accountExternalIdCredit,
      accountexternal_id_credit: createTransaction.accountExternalIdDebit,
      tranfer_type,
      value: createTransaction.value,
      status: TRANSACTION_STATUS.PENDING,
    };
    const transaction = this.transactionRepository.create(newTransaction);
    const response = await this.transactionRepository.save(transaction);
    this.clientKafka.emit(
      EVENT_TRANSACTION_VALIDATE,
      JSON.stringify({
        id: response.uuid,
        value: response.value,
      }),
    );
    return {
      transactionExternalId: response.uuid,
      transactionType: {
        name: tranfer_type,
      },
      transactionStatus: {
        name: TRANSACTION_STATUS.PENDING,
      },
      value: response.value,
      createdAt: response.created_at.toISOString(),
    };
  }

  async updateTransactionStatus(uuid: string, status: TRANSACTION_STATUS) {
    Logger.log(`updateTransactionStatus: ${JSON.stringify({ uuid, status })}`);
    const transaction = await this.transactionRepository.findOne({
      where: { uuid },
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.status = status;
    return await this.transactionRepository.save(transaction);
  }
}
