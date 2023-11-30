import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITRANSACTION_STATUSES, KAFKA_SERVICES } from '@app/constants';

import { CreateTransactionInput } from '../dto/create-transaction.input';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatusService } from './transactionStatus.service';
import { TransactionTypeervice } from './transactionType.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(KAFKA_SERVICES.ANTIFRAUD) private antiFraudClient: ClientKafka,
    private readonly transactionStatusService: TransactionStatusService,
    private readonly transactionTypeService: TransactionTypeervice,
  ) {}
  /**
   * Create a new Transaction record and send the event to the Anti-Fraud service
   * @param createTransactionInput Params according to the requirements
   * @returns new Transaction
   * For this example there is no implementation for Authentication or User info validations
   */
  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = createTransactionInput;
    const status = await this.transactionStatusService.findByName('PENDING');

    const type = await this.transactionTypeService.findById(tranferTypeId);

    if (!status && !type) {
      throw new InternalServerErrorException(
        'You must create status and type data before continuining',
      );
    }

    const newTransaction = {
      accountExternalIdDebit,
      accountExternalIdCredit,
      value,
      transactionType: type,
      transactionStatus: status,
    };
    const transaction = this.transactionRepository.create(newTransaction);
    const result = await this.transactionRepository.save(transaction);
    console.log({ result });
    this.antiFraudClient.emit('transaction_created', JSON.stringify(result));
    return result;
  }

  /**
   * This function handle the 'status' update after receiving the information through the
   * Anti-Fraud microservice.
   * @param transactionExternalId Id to indentify the transaction
   * This function should notify to an other microservices about the status of
   * this transaction after updating it so the user could know what happened with his transaction...
   */
  async transactionStatusHandler(
    transactionStatus: ITRANSACTION_STATUSES,
    transactionExternalId,
  ) {
    try {
      const transaction = await this.findOne(transactionExternalId);
      const status = await this.transactionStatusService.findByName(
        transactionStatus.toString(),
      );
      transaction.transactionStatus = status;
      await this.transactionRepository.save(transaction);

      // Should send a notification to the client
      // ...
    } catch (error) {
      throw new Error('Failed to update transaction');
    }
  }

  async findAll() {
    const result = await this.transactionRepository.find();
    console.log({ result });
    return result;
  }

  async findOne(transactionExternalId): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transaction: ${transactionExternalId} not found`,
      );
    }
    return transaction;
  }
}
