import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Transaction } from '../../database/entities/transaction.entity';
import { TransactionType } from '../../database/entities/transaction-type.entity';
import { TransactionStatus } from '../../database/entities/transaction-status.entity';
import { CreateTransactionInput } from './entities/transaction.entity';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { KafkaService } from '../../kafka/kafka.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    private kafkaService: KafkaService,
    private configService: ConfigService
  ) {}

  async createTransaction(
    input: CreateTransactionInput
  ): Promise<TransactionResponseDto> {
    const pendingStatus = await this.transactionStatusRepository.findOne({
      where: { name: 'Pending' },
    });

    if (!pendingStatus) {
      throw new Error('Pending transaction status not found');
    }

    const transactionType = await this.transactionTypeRepository.findOne({
      where: { id: input.tranferTypeId },
    });

    if (!transactionType) {
      throw new Error('Transaction type not found');
    }

    const transactionExternalId = uuidv4();
    const transaction = this.transactionRepository.create({
      transactionExternalId,
      accountExternalIdDebit: input.accountExternalIdDebit,
      accountExternalIdCredit: input.accountExternalIdCredit,
      transferTypeId: input.tranferTypeId,
      value: input.value,
      transactionTypeId: transactionType.id,
      transactionStatusId: pendingStatus.id,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    await this.kafkaService.sendMessage(
      this.configService.get(
        'KAFKA_TRANSACTION_CREATED_TOPIC',
        'transaction.created'
      ),
      {
        transactionExternalId: savedTransaction.transactionExternalId,
        value: savedTransaction.value,
        accountExternalIdDebit: savedTransaction.accountExternalIdDebit,
        accountExternalIdCredit: savedTransaction.accountExternalIdCredit,
        transferTypeId: savedTransaction.transferTypeId,
      }
    );

    return this.mapToResponse(savedTransaction, transactionType, pendingStatus);
  }

  async getTransaction(
    transactionExternalId: string
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
      relations: ['transactionType', 'transactionStatus'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.mapToResponse(
      transaction,
      transaction.transactionType,
      transaction.transactionStatus
    );
  }

  async updateTransactionStatus(
    transactionExternalId: string,
    statusName: string
  ): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const status = await this.transactionStatusRepository.findOne({
      where: { name: statusName },
    });

    if (!status) {
      throw new Error(`Transaction status '${statusName}' not found`);
    }

    await this.transactionRepository.update(
      { transactionExternalId },
      { transactionStatusId: status.id }
    );
  }

  private mapToResponse(
    transaction: Transaction,
    transactionType: TransactionType,
    transactionStatus: TransactionStatus
  ): TransactionResponseDto {
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        id: transactionType.id,
        name: transactionType.name,
      },
      transactionStatus: {
        id: transactionStatus.id,
        name: transactionStatus.name,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
