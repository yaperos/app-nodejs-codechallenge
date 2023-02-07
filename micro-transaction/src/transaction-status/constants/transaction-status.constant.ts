import { TransactionStatusEntity } from '../entities/transaction-status.entity';

export abstract class TransactionStatusConstant {
  static readonly tableName = 'transaction_status';
  static readonly pending: TransactionStatusEntity = {
    id_transaction_status: 1,
    name: 'Pendiente',
    description: 'La transaccion esta en estado pendiente.',
    key: 'pending',
  };
  static readonly approved: TransactionStatusEntity = {
    id_transaction_status: 2,
    name: 'Aprobado',
    description: 'La transaccion ha sido aprobada.',
    key: 'approved',
  };
  static readonly rejected: TransactionStatusEntity = {
    id_transaction_status: 3,
    name: 'Rechazada',
    description: 'La transaccion ha sido rechazada.',
    key: 'rejected',
  };

  static getListStatus() {
    return [
      TransactionStatusConstant.approved,
      TransactionStatusConstant.pending,
      TransactionStatusConstant.rejected,
    ];
  }
}
