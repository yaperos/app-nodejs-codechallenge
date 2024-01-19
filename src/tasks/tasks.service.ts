import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class TasksService {
  constructor(private transactionsService: TransactionsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    console.log('Running scheduled task to update transactions');
    await this.updatePendingTransactions();
  }

  private async updatePendingTransactions() {
    const pendingTransactions = await this.transactionsService.findPendingTransactionsLessThanOrEqualTo1000();
    for (const transaction of pendingTransactions) {
      await this.transactionsService.updateTransactionStatus(transaction.id, 'approved');
    }
  }
}
