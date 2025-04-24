import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/transaction/infrastructure/prisma/prisma.service';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, statusId: number) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        transactionStatusId: statusId,
      },
    });
  }
}
