import { ITransaction } from '../models/transaction';

export const CREATE_TRANSACTION = 'create_transaction';
export const FIND_ALL_TRANSACTION = 'find_all_transaction';
export const FIND_ONE_TRANSACTION = 'find_one_transaction';
export const UPDATE_TRANSACTION = 'update_transaction';
export const DELETE_TRANSACTION = 'delete_transaction';
export const TRANSACTION_CREATED = 'transaction_created';
export const APPROVED_TRANSACTION = 'approved_transaction';
export const REJECTED_TRANSACTION = 'rejected_transaction';

export class TransactionKey {
  public static readonly TRANSACTION_SCHEMA = 'TRANSACTION';
  public static readonly KAFKA_CLIENT = 'SECURITY_CLIENT';
  public static readonly REPOSITORY = 'REPOSITORY';
}
export interface ITransactionRepository {
  findAll: () => Promise<any>;
  findOne(id: any): Promise<any>;
  create(transaction: ITransaction): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): Promise<any>;
}
export interface ITransactionService extends ITransactionRepository {}
