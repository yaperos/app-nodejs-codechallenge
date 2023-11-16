import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Producer, KafkaClient, KeyedMessage } from 'kafka-node';


@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(transactionData: any): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);

    if (!transactionData.value || !transactionData.accountExternalIdDebit || !transactionData.accountExternalIdCredit || !transactionData.tranferTypeId ) {
      throw new BadRequestException('Error in transaction fields');
    }  
    if (transaction instanceof Transaction) {
      const [savedTransaction] = await this.transactionRepository.save([transaction]);
      let validatedTransatction = await this.validateTransatction([savedTransaction]);
      return savedTransaction;
    } else {
      throw new Error('Error createTransaction');
    }
  }

  async getTransaction(transactionExternalId: string): Promise<Transaction | undefined> {
    return this.transactionRepository.findOne({ where: { transactionExternalId } });
  }

  async validateTransatction(transactionData: any): Promise<Transaction> {
    try {
      return transactionData.map(transaction => {
        if (transaction.value < 1000 && transaction.value > 0) {
          transaction.updateTransactionStatus('approved');
        } else {
          transaction.updateTransactionStatus('rejected');
        }
        return transaction;
      });
    } catch (error) {
      throw new Error(`Error validateTransaction: ${error.message}`);
    }
  }
}


