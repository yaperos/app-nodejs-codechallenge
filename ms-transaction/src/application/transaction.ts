import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/Transaction.repository';
import { TransactionValue } from 'src/domain/Transaction.value.';
import { TransactionModel } from 'src/infraestructure/model/transaction.model';
import { PostgresRepository } from 'src/infraestructure/repository/postgre.repository';
import { getTransactionMapper } from './transaction.mapper';
import { TransactionResponse } from 'src/helper/type.helper';

@Injectable()
export class TransactionUseCase implements TransactionRepository {
  constructor(private readonly trxRepository: PostgresRepository) {}

  public registerTrx = async (data: any): Promise<TransactionModel> => {
    const trxValue = new TransactionValue(data);
    const trxCreated = await this.trxRepository.registerTrx(trxValue);
    return trxCreated;
  };

  public findTrx = async (id: string): Promise<TransactionResponse> => {
    const trx  = await this.trxRepository.findTrx(id);
    return getTransactionMapper(trx);
  };

  public updateStatus = async (id: string, newStatus: string):Promise<TransactionModel> => {
    const updateTrx = await this.trxRepository.updateStatus(id, newStatus);
    return updateTrx;
  };
}
