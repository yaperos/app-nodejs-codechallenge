import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { KafkaService } from '../kafka';
import { CreateTransactionDto, TransactionResponseDto } from './dto';

const KAFKA_TOPIC_TRANSACTION_CREATED = 'transaction-created';
const TRANSACTION_STATUS_PENDING = 'pending';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafka: KafkaService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    // Get pending status
    const pendingStatus = await this.prisma.transactionStatus.findUnique({
      where: { name: TRANSACTION_STATUS_PENDING },
    });

    if (!pendingStatus) {
      throw new Error('Pending status not found in database');
    }

    // Get transaction type
    const transactionType = await this.prisma.transactionType.findUnique({
      where: { id: createTransactionDto.tranferTypeId },
    });

    if (!transactionType) {
      throw new NotFoundException(
        `Transaction type with id ${createTransactionDto.tranferTypeId} not found`,
      );
    }

    // Create transaction with pending status
    const transaction = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        value: createTransactionDto.value,
        transactionTypeId: createTransactionDto.tranferTypeId,
        transactionStatusId: pendingStatus.id,
      },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });

    this.logger.log(`Transaction created with id: ${transaction.id}`);

    // Publish event to Kafka
    const event = {
      transactionExternalId: transaction.id,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      tranferTypeId: transaction.transactionTypeId,
      value: Number(transaction.value),
      createdAt: transaction.createdAt,
    };

    await this.kafka.produce(KAFKA_TOPIC_TRANSACTION_CREATED, event);
    this.logger.log(
      `Event published to ${KAFKA_TOPIC_TRANSACTION_CREATED}: ${transaction.id}`,
    );

    return this.mapToResponse(transaction);
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return this.mapToResponse(transaction);
  }

  async updateStatus(transactionId: string, status: string): Promise<void> {
    const transactionStatus = await this.prisma.transactionStatus.findUnique({
      where: { name: status },
    });

    if (!transactionStatus) {
      throw new Error(`Status ${status} not found in database`);
    }

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { transactionStatusId: transactionStatus.id },
    });

    this.logger.log(
      `Transaction ${transactionId} status updated to: ${status}`,
    );
  }

  private mapToResponse(transaction: any): TransactionResponseDto {
    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: Number(transaction.value),
      createdAt: transaction.createdAt,
    };
  }
}
