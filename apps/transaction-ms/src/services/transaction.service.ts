import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionStatusService } from './transaction-status.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
    private transactionTypeService: TransactionTypeService,
    private transactionStatusService: TransactionStatusService,
  ) {}

  async findOne(transactionExternalId: string): Promise<Transaction> {
    const transaction = await this.repository.findOne({
      where: { transactionExternalId },
      select: {
        accountExternalIdDebit: false,
        accountExternalIdCredit: false,
        transactionType: {
          id: false,
          name: true,
        },
        transactionStatus: {
          id: false,
          name: true,
        },
      },
      relations: {
        transactionType: true,
        transactionStatus: true,
      },
    });

    if (!transaction) throw new BadRequestException('Transaction not found');

    return transaction;
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transactionType = await this.transactionTypeService.findOne(
      createTransactionDto.transactionTypeId,
    );

    if (!transactionType)
      throw new BadRequestException('Transaction type not found');

    const transaction = new Transaction();
    transaction.transactionExternalId = uuid();
    transaction.accountExternalIdDebit =
      createTransactionDto.accountExternalIdDebit;
    transaction.accountExternalIdCredit =
      createTransactionDto.accountExternalIdCredit;
    transaction.transactionType = transactionType;
    transaction.value = createTransactionDto.value;
    return await this.repository.save(transaction);
  }

  async updateStatus(
    transactionExternalId: string,
    transactionStatusName: string,
  ): Promise<Transaction> {
    return await this.repository.manager.transaction(
      async (entityManager: EntityManager) => {
        const transaction = await entityManager
          .createQueryBuilder(Transaction, 'transaction')
          .where('transaction.transactionExternalId = :id', {
            id: transactionExternalId,
          })
          .setLock('pessimistic_write')
          .getOne();

        if (!transaction)
          throw new BadRequestException('Transaction not found');

        const transactionStatus = await this.transactionStatusService.findOne(
          transactionStatusName,
        );

        if (!transactionStatus)
          throw new BadRequestException('Transaction status not found');

        transaction.transactionStatus = transactionStatus;
        await entityManager.save(transaction);

        return transaction;
      },
    );
  }
}
