import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { KafkaService } from '../shared/kafka/kafka.service';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const newTransaction = await this.prismaService.transaction.create({
      data: {
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        transferTypeId: 1,
        value: createTransactionDto.value,
        transactionStatus: 'PENDING',
      },
    });
    this.kafkaService.sendMessage('transactions-pending', newTransaction);
    return newTransaction;
  }

  async pullProcessedTransaction(transaction: UpdateTransactionDto) {
    const updatedTransaction = await this.prismaService.transaction.update({
      where: {
        transactionExternalId: transaction.transactionExternalId,
      },
      data: {
        transactionStatus: transaction.transactionStatus,
      },
    });
    console.log(updatedTransaction);
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
