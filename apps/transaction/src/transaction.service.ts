import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateTransactionDto) {
    // Validar si el tipo de transacción existe
    const transactionType = await this.prisma.transactionType.findUnique({
      where: { id: dto.transferTypeId },
    });
    if (!transactionType) {
      throw new NotFoundException('Transaction type not found');
    }
    // Estado inicial: pending (debe existir en la tabla TransactionStatus)
    const pendingStatus = await this.prisma.transactionStatus.findUnique({
      where: { name: 'pending' },
    });
    if (!pendingStatus) {
      throw new NotFoundException('Transaction status "pending" not found');
    }
    const transaction = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        transferTypeId: dto.transferTypeId,
        value: dto.value,
        transactionStatusId: pendingStatus.id,
      },
    });
    return { transactionExternalId: transaction.id };
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return {
      transactionExternalId: transaction.id,
      transactionType: { name: transaction.transactionType.name },
      transactionStatus: { name: transaction.transactionStatus.name },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
