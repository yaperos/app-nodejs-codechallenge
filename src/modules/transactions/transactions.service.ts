import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '@shared/logger/logger.service';
import {
  CreateTransactionDto,
  TransactionDto,
  TransactionEntityDto,
} from './transactions.dto';
import { TransactionsEntity } from '@entities/transactions.entity';
import {
  mapTransactionToEntity,
  mapTransactionToResponse,
} from './mappers/transactions.mapper';

@Injectable()
export class TransactionsService extends LoggerService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
  ) {
    super(TransactionsService.name);
  }

  async createTransaction(
    dataForCreateTransaction: CreateTransactionDto,
  ): Promise<TransactionDto> {
    const transactionTransformedToEntity: TransactionEntityDto =
      mapTransactionToEntity(dataForCreateTransaction);
    const transactionSaved = await this.save(transactionTransformedToEntity);

    return mapTransactionToResponse(transactionSaved);
  }

  async getTransactionByExternalId(
    transactionExternalId: string,
  ): Promise<TransactionDto> {
    const transactionOnDatabase: TransactionsEntity =
      await this.findOneByTransactionExternalId(transactionExternalId);

    return mapTransactionToResponse(transactionOnDatabase);
  }

  private async save(
    transactionTransformedToEntity: TransactionEntityDto,
  ): Promise<TransactionsEntity> {
    return this.transactionsRepository.save(transactionTransformedToEntity);
  }

  private async findOneByTransactionExternalId(
    transactionExternalId: string,
  ): Promise<TransactionsEntity> {
    return this.transactionsRepository.findOneOrFail({
      transaction_external_id: transactionExternalId,
    });
  }
}
