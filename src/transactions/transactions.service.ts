import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { STATUSES, limitAmout } from '../config/config'

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private kafkaService: KafkaService
  ) {}


  async create(createTransactionDto: CreateTransactionDto) {
    let status = STATUSES.PENDING

    if (createTransactionDto.value > limitAmout) {
      const rejectedTransaction = await this.prisma.transaction.create({
        data: {
          ...createTransactionDto,
          status: STATUSES.REJECTED,
        },
      });
      return { 
        transaction: rejectedTransaction,
        message: 'Transaction was rejected due to high value'
      };
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        status:  STATUSES.PENDING,
      },
    });

    if (status === STATUSES.PENDING) {
      console.log(`Transaction with ID ${transaction.id} will be process in 1 minute.`);
    }

    return transaction;
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: Number(id) },
    });
    return transaction;
  }

  async findAll() {
    return await this.prisma.transaction.findMany();
  }

  async findPendingTransactionsLessThanOrEqualTo1000() {
    return this.prisma.transaction.findMany({
      where: {
        AND: [
          { value: { lte: limitAmout } },
          { status: STATUSES.PENDING },
        ],
      },
    });
  }

  async updateTransactionStatus(id: number, status: string) {
    return await this.prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }
}
