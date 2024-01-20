import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { KafkaService } from 'src/kafka/kafka.service';
import { TransactionStatus } from 'src/entities/transactionStatus.entity';
import { TransferType } from 'src/entities/transferType.entity';
import { CreateTransactionDto } from 'src/dtos/createTransaction.dto';
import { TransactionDto } from 'src/dtos/transaction.dto';
import { TransactionResponse } from 'src/interfaces/transaction-response.interface';
import {
  KAFKA_TOPICS,
  TRANSACTION_STATUS,
} from 'src/constants/kafka.constants';
import { ERROR_MESSAGES } from 'src/constants/error-messages.constants';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private statusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransferType)
    private transferTypeRepository: Repository<TransferType>,
    @Inject(forwardRef(() => KafkaService))
    private kafkaService: KafkaService,
  ) {}

  async create(
    transactionData: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    const pendingStatus = await this.getPendingStatus();
    const transferType = await this.getTransferType(
      transactionData.transferTypeId,
    );

    const transaction = this.transactionRepository.create({
      ...transactionData,
      transactionStatus: pendingStatus,
      transferType,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    if (!savedTransaction) {
      throw new BadRequestException(ERROR_MESSAGES.TransactionSaveError);
    }

    await this.produceTransactionCreatedEvent(savedTransaction);

    return this.mapToTransactionResponse(savedTransaction);
  }

  private async getPendingStatus(): Promise<TransactionStatus> {
    const pendingStatus = await this.statusRepository.findOne({
      where: { name: TRANSACTION_STATUS.Pending },
    });
    if (!pendingStatus) {
      throw new BadRequestException(ERROR_MESSAGES.PendingStatusNotFoundError);
    }
    return pendingStatus;
  }

  private async getTransferType(transferTypeId: number): Promise<TransferType> {
    const transferType = await this.transferTypeRepository.findOne({
      where: { transferTypeId },
    });
    if (!transferType) {
      throw new BadRequestException(ERROR_MESSAGES.TransferTypeNotFoundError);
    }
    return transferType;
  }

  private mapToTransactionResponse(
    transaction: Transaction,
  ): TransactionResponse {
    return {
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      value: transaction.value,
      createdAt: transaction.createdAt,
      transferType: { name: transaction.transferType.name },
      transactionStatus: { name: transaction.transactionStatus.name },
    };
  }

  private async produceTransactionCreatedEvent(
    transaction: Transaction,
  ): Promise<void> {
    for (let attempts = 0, delay = 5000; attempts < 5; attempts++) {
      try {
        await this.kafkaService.produce(
          KAFKA_TOPICS.TransactionCreated,
          JSON.stringify({
            transactionExternalId: transaction.transactionExternalId,
            value: transaction.value,
          }),
        );
        break;
      } catch (error) {
        this.logger.warn(
          ERROR_MESSAGES.KafkaProduceEventRetry(attempts + 1),
          error.message,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  async findOne(id: string): Promise<TransactionResponse> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: id },
      relations: ['transferType', 'transactionStatus'], // Cargar relaciones
    });

    if (!transaction) {
      throw new BadRequestException(ERROR_MESSAGES.TransactionNotFoundError);
    }

    return {
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      value: transaction.value,
      createdAt: transaction.createdAt,
      transferType: { name: transaction.transferType.name },
      transactionStatus: { name: transaction.transactionStatus.name },
    };
  }

  async updateTransactionStatus(
    transactionDto: TransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: transactionDto.transactionExternalId },
    });

    if (!transaction) {
      throw new Error(ERROR_MESSAGES.TransactionNotFoundError);
    }

    const newStatus = await this.statusRepository.findOne({
      where: { name: transactionDto.status },
    });

    if (!newStatus) {
      throw new Error(ERROR_MESSAGES.StatusNotFoundError);
    }

    transaction.transactionStatus = newStatus;
    return await this.transactionRepository.save(transaction);
  }
}
