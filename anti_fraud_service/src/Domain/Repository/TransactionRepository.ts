import { AxiosResponse } from 'axios';
import { GetTransaction, UpdateTransaction } from '../Entitys';

export interface TransactionInterfaceRepository {
  getTransaction(idTransaction: string): Promise<GetTransaction>;
  updateTransaction(
    idTransaction: string,
    status: string,
  ): Promise<UpdateTransaction>;
}
