import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionRepository } from '@/modules/transaction/domain/repositories/transaction.repository';
import { Transaction } from '@/modules/transaction/domain/entities/transaction.entity';

/**
 * Implementation of the TransactionRepository interface using Prisma ORM.
 * 
 * This class is responsible for data persistence operations related to transactions,
 * including finding, saving, and updating transaction status.
 */
@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds a transaction by its unique ID, including its type and status relationships.
   * 
   * @param id - The unique identifier of the transaction.
   * @returns The transaction with its relations, or null if not found.
   */
  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });
  }

  /**
   * Persists a new transaction in the database.
   * 
   * @param transaction - The transaction entity to be saved.
   * @returns The saved transaction.
   */
  async save(transaction: Transaction): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        id: transaction.id,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        transferTypeId: transaction.transferTypeId,
        value: transaction.value,
        transactionStatusId: transaction.transactionStatusId,
      },
    });
  }

  /**
   * Updates the status of an existing transaction.
   * 
   * @param id - The unique identifier of the transaction.
   * @param statusId - The new status ID to assign.
   * @returns The updated transaction.
   */
  async updateStatus(id: string, statusId: number): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { transactionStatusId: statusId },
    });
  }
}
