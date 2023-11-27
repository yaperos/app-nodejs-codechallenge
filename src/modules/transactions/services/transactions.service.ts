import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import * as dayjs from 'dayjs';
import { ApiError } from 'src/common/api-errors/api-error';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ETransactionStatus } from 'src/domain/enums/transaction-status.enum';
import { DataAccessService } from 'src/infra/cache/data-access.service';
import { TransactionStatusService } from 'src/modules/transaction-status/services/transaction-status.service';
import { TransactionTypeService } from 'src/modules/transaction-type/services/transaction-type.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionRequestDTO } from '../dto/create-transaction-request.dto';

export const transactionAmountRestriction = 1000;

@Injectable()
export class TransactionsService extends DataAccessService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private transactionTypeService: TransactionTypeService,
    private transactionStatusService: TransactionStatusService,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache,
    protected configService: ConfigService,
  ) {
    super(cacheManager, configService, 'transaction', TransactionsService.name);
  }

  async getById(id: string): Promise<Transaction | null> {
    const itemCacheKey = this.cacheKey(id);

    const dbQuery = async function () {
      return await this.transactionRepository.findOne({
        where: { id },
        relations: { status: true, type: true },
      });
    };

    return await this.findOrFetchFromDatabase<Transaction>(
      itemCacheKey,
      dbQuery.bind(this),
    );
  }

  async create({
    accountExternalIdCredit,
    accountExternalIdDebit,
    transferTypeId,
    value,
  }: CreateTransactionRequestDTO): Promise<Transaction> {
    if (value > transactionAmountRestriction)
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        `transaction amount is greater then the limit allowed (${transactionAmountRestriction})`,
      );

    const [transactionType, transactionStatus] = await Promise.all([
      this.transactionTypeService.getById(transferTypeId),
      this.transactionStatusService.getByName(ETransactionStatus.PENDING),
    ]);

    if (!transactionType)
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        `invalid transaction type (${transferTypeId})`,
      );
    if (!transactionStatus)
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `transaction type with name "${ETransactionStatus.PENDING}" not found`,
      );

    const now = dayjs();
    const transaction = this.transactionRepository.create({
      id: uuidv4(),
      accountCreditId: accountExternalIdCredit,
      accountDebitId: accountExternalIdDebit,
      amount: value,
      status: transactionStatus,
      type: transactionType,
      createdAt: now,
      updatedAt: now,
    });
    await this.transactionRepository.save(transaction);
    this.logger.log(`new transaction created with id ${transaction.id}`);

    return transaction;
  }
}
