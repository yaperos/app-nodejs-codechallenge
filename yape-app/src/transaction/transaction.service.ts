import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AntiFraudDecision,
  SaveTransactionRequest,
  UpdateTransactionRequest,
} from './dto';
import { ClientKafka } from '@nestjs/microservices';

const STATES = ['pending', 'approved', 'rejected'];
const TRANSACTIONS = ['yape'];

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly antiFraudClient: ClientKafka,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async getTransactions(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: {
        transactionType: true,
        transactionStatus: true,
      },
      select: [
        'transactionExternalId',
        'transactionType',
        'transactionStatus',
        'value',
        'createdAt',
      ],
    });
  }

  async getTransaction(id: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: {
        transactionType: true,
        transactionStatus: true,
      },
      select: [
        'transactionExternalId',
        'transactionType',
        'transactionStatus',
        'value',
        'createdAt',
      ],
      where: {
        transactionExternalId: id,
      },
    });
  }

  async save(
    saveTransactionRequest: SaveTransactionRequest,
  ): Promise<Transaction> {
    const type = await this.getType(TRANSACTIONS[0]);
    const status = await this.getStatus(STATES[0]);
    const transaction = {
      accountExternalIdDebit: saveTransactionRequest.accountExternalIdDebit,
      accountExternalIdCredit: saveTransactionRequest.accountExternalIdCredit,
      transactionTypeId: type.id,
      transactionStatusId: status.id,
      value: saveTransactionRequest.value,
    };

    const transactionSaved = await this.transactionRepository.save(transaction);
    this.antiFraudClient
      .send('transaction_save', JSON.stringify(transactionSaved))
      .subscribe((antiFraudDecision: AntiFraudDecision) => {
        console.log('transaction_save - antiFraudDecision', antiFraudDecision);
        this.update(antiFraudDecision);
      });
    return transactionSaved;
  }

  async update(
    updateTransactionRequest: UpdateTransactionRequest,
  ): Promise<Transaction> {
    const newStatus = await this.getStatus(
      updateTransactionRequest.transactionStatus.name,
    );
    const transaction = {
      transactionExternalId: updateTransactionRequest.transactionExternalId,
      transactionStatus: newStatus,
    };
    return this.transactionRepository.save(transaction);
  }

  async getStatus(name: string) {
    const status = await this.transactionStatusRepository.findOne({
      where: {
        name: name,
      },
    });
    if (!status) {
      return this.saveStatus(name);
    }
    return status;
  }

  async getType(name: string) {
    const type = await this.transactionTypeRepository.findOne({
      where: {
        name: name,
      },
    });
    if (!type) {
      return this.saveType(name);
    }
    return type;
  }

  async saveStatus(name: string) {
    const status = await this.transactionStatusRepository.save({
      name: name,
    });
    return status;
  }

  async saveType(name: string) {
    const type = await this.transactionTypeRepository.save({
      name: name,
    });
    return type;
  }

  onModuleInit() {
    this.antiFraudClient.subscribeToResponseOf('transaction_save');
  }
}
