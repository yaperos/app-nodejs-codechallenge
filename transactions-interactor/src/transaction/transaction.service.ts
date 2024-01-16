import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import {
  Transaction,
  TransactionStatus,
} from 'src/entities/transaction.entity';
import { KafkaService } from 'src/shared/kafka/kafka.service';
import { Account } from 'src/entities/account.entity';

@Injectable()
export class TransactionService {
  private kafka;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionModel: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountModel: Repository<Account>,
    private readonly kafkaService: KafkaService,
  ) {}

  async createTransaction(transaction: TransactionDto): Promise<any> {
    const debitAccount = await this.accountModel.findOne({
      where: { id: transaction.accountExternalIdDebit },
    });
    const creditAccount = await this.accountModel.findOne({
      where: { id: transaction.accountExternalIdCredit },
    });

    if (!debitAccount || !creditAccount) {
      throw new Error('Accounts not found');
    }
    const objectTrx = {
      value: transaction.value,
      id: uuid.v4(),
      status: TransactionStatus.Pending,
      created_at: new Date(),
      transfer_type_id: transaction.transferTypeId,
      account_external_id_debit: debitAccount,
      account_external_id_credit: creditAccount,
    };

    const response = await this.transactionModel.save([objectTrx]);
    await this.kafkaService.sendMessage('transaction-to-verify', {
      id: objectTrx.id,
      value: objectTrx.value,
    });
    return response;
  }

  async approveTransaction(transactionId: string): Promise<Transaction> {
    const foundTransaction = await this.transactionModel.findOne({
      where: { id: transactionId },
    });
    const transactionToSave = {
      ...foundTransaction,
      status: TransactionStatus.Approved,
    };
    await this.transactionModel.save(transactionToSave);
    return transactionToSave;
  }

  async rejectTransaction(transactionId: string): Promise<Transaction> {
    const foundTransaction = await this.transactionModel.findOne({
      where: { id: transactionId },
    });
    const transactionToSave = {
      ...foundTransaction,
      status: TransactionStatus.Rejected,
    };
    await this.transactionModel.save(transactionToSave);
    return transactionToSave;
  }
}
