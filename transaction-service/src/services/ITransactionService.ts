import { Transaction } from '../entities/Transaction';
import { TransactionStatusName } from '../enum/TransactionStatusName';

export interface ITransactionService {

  /**
   * Crea una nueva transacción en el sistema
   */
  createTransaction(data: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
  }): Promise<Transaction>;

  /**
   * Obtiene una transacción por su identificador externo
   */

  getTransactionById(transactionExternalId: string): Promise<Transaction | null>;

  /**
   * Actualiza el estado de una transacción existente
   */
  
  updateTransactionStatus(transactionExternalId: string, status: TransactionStatusName): Promise<Transaction | null>;
}
  