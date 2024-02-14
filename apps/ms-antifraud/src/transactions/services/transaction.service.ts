import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../common/entities/transaction.entity';
import { TransactionDto } from '../../common/dto/transaction.dto';
import { CreateTransactionInput } from '../../common/dto/transaction.input';
import { TransactionStatuses } from '../../common/enums/transaction-statuses.enum';
import { NewTransactionPayload } from 'src/common/types/transaction.interface';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      return await this.transactionRepository.find();
    } catch (error) {
      this.logger.error(`Error in getAllTransactions: ${error.message}`);
      throw error;
    }
  }

  async updateTransaction(transactionData: TransactionDto, transactionStatus: string): Promise<void> {
    try {
      await this.transactionRepository.update(
        { transactionExternalId: transactionData.transactionExternalId },
        { transferStatusId: TransactionStatuses[transactionStatus] },
      );
    } catch (error) {
      this.logger.error(`Error in updateTransaction: ${error.message}`);
      throw error;
    }
  }

  async storeTransaction(transactionData: CreateTransactionInput): Promise<TransactionDto> {
    try {
      const payload: NewTransactionPayload = {
        accountExternalIdDebit: transactionData.accountExternalIdDebit,
        accountExternalIdCredit: transactionData.accountExternalIdCredit,
        transferTypeId: transactionData.transferTypeId,
        value: transactionData.value,
        transferStatusId: TransactionStatuses.pending,
      };

      const result = await this.transactionRepository.insert(payload);

      const insertedTransaction = await this.transactionRepository.findOne({
        where: { transactionExternalId: result.identifiers[0]?.transactionExternalId },
        relations: ['transactionType', 'transactionStatus'],
      });

      if (!insertedTransaction) {
        throw new Error('Transaction not found after insertion');
      }

      return insertedTransaction;
    } catch (error) {
      this.logger.error(`Error in storeTransaction: ${error.message}`);
      throw error;
    }
  }
}
