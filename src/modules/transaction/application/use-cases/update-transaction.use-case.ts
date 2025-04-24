import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/transaction/infrastructure/prisma/prisma.service';

/**
 * Use case responsible for updating the status of an existing transaction.
 */
@Injectable()
export class UpdateTransactionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes the update logic for a transaction.
   *
   * @param id - The unique identifier of the transaction to update.
   * @param statusId - The new status ID to assign to the transaction.
   * @returns The updated transaction object.
   * @throws NotFoundException if the transaction with the given ID does not exist.
   */
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
