import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatusEnum, TransactionStatusId } from '../../common';
import { EnvConfig } from '../../config/env.config';
import { Transaction, TransactionType } from '../../entities';
import {
  AntifraudPattern,
  CreateTransactionDto,
  ValidateTransactionDto,
} from './transaction.types';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(EnvConfig.antifraudKafkaConfig().name)
    private readonly antifraudClient: ClientKafka,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Partial<Transaction & CreateTransactionDto>> {
    try {
      Logger.log(
        `Create transaction request started with: ${JSON.stringify(
          createTransactionDto,
        )}`,
        TransactionService.name,
      );

      const transactionType = await this.transactionTypeRepository.findOne({
        where: { id: createTransactionDto.tranferTypeId },
      });

      if (!transactionType) {
        throw new Error('Transaction type selected doesnt exists');
      }

      const savedTransaction = await this.transactionRepository.save({
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        value: createTransactionDto.amount,
        transactionType,
        transactionStatus: {
          id: TransactionStatusId[TransactionStatusEnum.PENDING],
          name: TransactionStatusEnum.PENDING,
        },
      });

      Logger.log(
        `Transaction created: ${JSON.stringify(savedTransaction)}`,
        TransactionService.name,
      );

      this.antifraudClient.emit(AntifraudPattern.VALIDATE_ANTIFRAUD, {
        ...createTransactionDto,
        id: savedTransaction.id,
      });

      const { value, ...rest } = savedTransaction;

      return { ...rest, amount: value };
    } catch (error) {
      Logger.error(error.message, TransactionService.name);
      return null;
    }
  }

  async validateTransaction(
    validateTransactionDto: ValidateTransactionDto,
  ): Promise<void> {
    try {
      Logger.log(
        `Validate transaction request started with: ${JSON.stringify(
          validateTransactionDto,
        )}`,
        TransactionService.name,
      );
      const transaction = await this.transactionRepository.findOne({
        where: {
          id: validateTransactionDto.id,
        },
      });
      const statusToUpdate = validateTransactionDto.isValidAmount
        ? TransactionStatusEnum.APPROVED
        : TransactionStatusEnum.REJECTED;

      await this.transactionRepository.update(
        {
          id: transaction.id,
        },
        {
          transactionStatus: {
            id: TransactionStatusId[statusToUpdate],
          },
        },
      );

      Logger.log(
        `Update transaction sucess with status: ${statusToUpdate}`,
        TransactionService.name,
      );
    } catch (error) {
      Logger.error(error.message, TransactionService.name);
    }
  }
}
