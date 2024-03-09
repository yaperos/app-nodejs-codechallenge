import { Body, Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'src/transaction/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';
import { CreateTransactionServiceRes } from 'src/interfaces/create-transaction-service-res';
import { TransactionTypeService } from 'src/transaction-type/transaction-type/transaction-type.service';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    private transactionStatusService: TransactionStatusService,
    private transactionTypeService: TransactionTypeService
  ) {}

  async createTransaction(@Body() createTransactionDto: CreateTransactionReq): Promise<CreateTransactionServiceRes> {
    try {
      const transactionStatus = await this.transactionStatusService.findByName('pending');

      const transactionType = await this.transactionTypeService.findById(createTransactionDto.tranferTypeId);

      if (!transactionType) {
        throw new Error("Transfer type doesn't exist!");
      }

      const dbResponse = await this.transactionRepository.insert(
        {
          accountExternalIdDebit: createTransactionDto.accountExternalIdCredit,
          accountExternalIdCredit: createTransactionDto.accountExternalIdDebit,
          tranferType: transactionType,
          value: createTransactionDto.value,
          createdAt: (new Date()).toISOString(),
          updatedAt: (new Date()).toISOString(),
          status: transactionStatus
        } 
      );
      return new CreateTransactionServiceRes(true, 'Transaction created with successful!', dbResponse.raw[0].id);
    } catch (error) {
      return new CreateTransactionServiceRes(false, error.message);
    }
  }

  async updateTransaction(message: any): Promise<any> {
    try {
      const transactionStatus = await this.transactionStatusService.findByName(message.status);

      this.transactionRepository.update(message.transactionExternalId, { updatedAt: (new Date()).toISOString(), status: transactionStatus });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllTransactions(): Promise<any> {
    try {
      return this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.status', 'transactionStatus')
        .leftJoinAndSelect('transaction.tranferType', 'transactionType')
        .select(["transaction.id","transactionType.name", "transactionStatus.name", "transaction.value", "transaction.createdAt"])
        .getMany();
    } catch (error) {
      return error;
    }
  }
}
