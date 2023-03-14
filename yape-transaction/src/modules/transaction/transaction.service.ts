import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import {
  AntifraudPattern,
  TransactionStatusEnum,
  TransactionStatusId,
} from '@core/config/constants';
import { environment } from '@core/config/environment';
import { RedisCacheService } from '@core/cache';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { TransactionType, Transaction, TransactionStatus } from './entities';
import { PageDto, PageMetaDto, PageOptionsDto } from '@core/types/pagination';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @Inject(environment.antifraudKafkaConfig.name)
    private readonly antifraudClient: ClientKafka,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
    private readonly redisService: RedisCacheService,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    this.logger.log('Creating transaction');

    try {
      const transactionType = await this.findTypeTransaction(
        createTransactionDto.tranferTypeId,
      );

      if (!transactionType) {
        this.logger.warn('Transaction type not found');
        throw new Error('Transaction type not found');
      }

      const transactionResponse = await this.transactionRepository.save({
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        value: createTransactionDto.value,
        transactionType,
        transactionStatus: {
          id: TransactionStatusId[TransactionStatusEnum.PENDING],
          name: TransactionStatusEnum.PENDING,
        },
      });

      this.logger.log(
        `Transaction EMIT : ${AntifraudPattern.VALIDATE_ANTIFRAUD}`,
      );

      this.antifraudClient.emit(
        AntifraudPattern.VALIDATE_ANTIFRAUD,
        JSON.stringify({
          ...transactionResponse,
          transactionExternalId: transactionResponse.transactionExternalId,
        }),
      );

      await this.redisService.saveTransaction(
        transactionResponse.transactionExternalId,
        transactionResponse,
      );

      this.logger.log({
        message: 'Transaction created',
        transaction: transactionResponse,
      });

      const { value, ...rest } = transactionResponse;

      return { ...rest, amount: value };
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  private async findTypeTransaction(
    tranferTypeId: number,
  ): Promise<TransactionType> {
    return this.transactionTypeRepository.findOne({
      where: { id: tranferTypeId },
    });
  }

  async getAllTransactions(pageOptionsDto: PageOptionsDto) {
    this.logger.log({ message: 'Paginated transactions', pageOptionsDto });

    const [transactions, itemCount] =
      await this.transactionRepository.findAndCount({
        take: pageOptionsDto.take,
        skip: pageOptionsDto.skip,
        relations: {
          transactionStatus: true,
          transactionType: true,
        },
      });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return JSON.stringify(new PageDto(transactions, pageMetaDto));
  }

  async findOne(transactionExternalId: string): Promise<string> {
    this.logger.log(
      `Find Transaction transactionExternalId: ${transactionExternalId}`,
    );
    try {
      const transactionRedis = await this.redisService.getTransaction(
        transactionExternalId,
      );

      if (transactionRedis) {
        return JSON.stringify(transactionRedis);
      }

      const transaction = await this.transactionRepository.findOneOrFail({
        where: { transactionExternalId },
        relations: {
          transactionType: true,
          transactionStatus: true,
        },
      });

      return JSON.stringify(transaction);
    } catch (error) {
      this.logger.log(error);
      return null;
    }
  }

  async rejectedTransaction(
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<void> {
    this.logger.log({ message: 'Rejected Transaction ', updateTransactionDto });
    try {
      await this.transactionRepository.update(
        {
          transactionExternalId: updateTransactionDto.transactionExternalId,
        },
        {
          transactionStatus: {
            id: TransactionStatusId[TransactionStatusEnum.REJECTED],
          },
        },
      );

      await this.saveTransactionToCache(
        updateTransactionDto.transactionExternalId,
        TransactionStatusEnum.REJECTED,
      );

      this.logger.log(
        `Transaction updated successfully with status ${TransactionStatusEnum.REJECTED}`,
      );
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async approvedTransaction(
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<void> {
    this.logger.log({ message: 'Approved Transaction ', updateTransactionDto });
    try {
      await this.transactionRepository.update(
        {
          transactionExternalId: updateTransactionDto.transactionExternalId,
        },
        {
          transactionStatus: {
            id: TransactionStatusId[TransactionStatusEnum.APPROVED],
          },
        },
      );

      await this.saveTransactionToCache(
        updateTransactionDto.transactionExternalId,
        TransactionStatusEnum.APPROVED,
      );

      this.logger.log(
        `Transaction updated successfully with status ${TransactionStatusEnum.APPROVED}`,
      );
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  private async saveTransactionToCache(
    transactionExternalId: string,
    transactionStatusEnum: TransactionStatusEnum,
  ): Promise<void> {
    const previousTransaction = await this.redisService.getTransaction(
      transactionExternalId,
    );

    await this.redisService.saveTransaction(transactionExternalId, {
      ...previousTransaction,
      transactionStatus: {
        name: transactionStatusEnum,
      } as TransactionStatus,
    });
  }
}
