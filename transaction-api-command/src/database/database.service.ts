import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OutBox } from './outbox.entity';
import { TransactionStatus } from 'src/transaction/transaction-status';

@Injectable()
export class DataBaseService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(OutBox)
    private outboxRepository: Repository<OutBox>,
  ) {}

  async saveTransaction(transactionData): Promise<Transaction> {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    } = transactionData;

    const newTransaction = this.transactionRepository.create({
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    });

    const savedTransaction =
      await this.transactionRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const transaction = await transactionalEntityManager.save(
            Transaction,
            newTransaction,
          );

          const outboxEntry = new OutBox();
          outboxEntry.topic = 'transaction-created';
          outboxEntry.key = transaction.id;
          outboxEntry.value = JSON.stringify(transaction);
          outboxEntry.createdAt = Date.now();

          await transactionalEntityManager.save(OutBox, outboxEntry);

          return transaction;
        },
      );
    return savedTransaction;
  }

  async getOutboxMessages() {
    let messages: OutBox[] = [];
    // Let's consider INDEX on (status & createdAt column) for performance
    messages = await this.outboxRepository.manager.query(
      `SELECT * FROM "out_box" WHERE status = 'PENDING'  ORDER BY "createdAt" ASC FOR UPDATE SKIP LOCKED LIMIT 10`,
    );

    return messages;
  }

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<boolean> {

    return await this.transactionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // First, fetch the current status of the transaction
        const transaction = await transactionalEntityManager.findOne(
          Transaction,
          {
            where: { id },
          },
        );

        // Check if the transaction exists and its status is 'pending'
        if (transaction && transaction.status === TransactionStatus.PENDING) {
          // Update the status of the Transaction
          await transactionalEntityManager.update(Transaction, id, {
            status: status,
          });

          // Update the status of the OutBox if the Transaction status is 'pending'
          await transactionalEntityManager.update(
            OutBox,
            {
              key: id,
            },
            {
              status: status,
            },
          );
          return true;
        } else {
          return false;
        }
      },
    );
  }
}
