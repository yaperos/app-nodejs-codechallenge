import { TransactionStatusEntity } from '../entities/transaction-status.entity';
import { TransactionStatusIdsEnum } from './transaction-status-ids.enum';

export class TransactionStatusConstant {
  static readonly tableName = 'transaction_status';
  static readonly pending: TransactionStatusEntity = {
    id_transaction_status: TransactionStatusIdsEnum.pendingId,
    name: 'Pendiente',
    description: 'La transaccion esta en estado pendiente.',
    key: 'pending',
  };
  static readonly approved: TransactionStatusEntity = {
    id_transaction_status: TransactionStatusIdsEnum.approvedId,
    name: 'Aprobado',
    description: 'La transaccion ha sido aprobada.',
    key: 'approved',
  };
  static readonly rejected: TransactionStatusEntity = {
    id_transaction_status: TransactionStatusIdsEnum.rejectedId,
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
