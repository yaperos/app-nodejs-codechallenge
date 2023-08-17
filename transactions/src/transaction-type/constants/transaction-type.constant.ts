import { TransactionTypesIdsEnum } from './transaction-types-ids.enum';

export abstract class TransactionTypesConstant {
  static readonly tableName = 'transaction_types';
  static readonly transfer = {
    id_transaction_type: TransactionTypesIdsEnum.transferId,
    name: 'Transferencia',
    key: 'transfer',
    description: 'Transferencia de Fondos.',
  };
  static readonly withdrawal = {
    id_transaction_type: TransactionTypesIdsEnum.withdrawal,
    name: 'Retiro',
    key: 'withdrawal',
    description: 'Retiro de Fondos.',
  };

  static getListTransactionsTypes() {
    return [
      TransactionTypesConstant.transfer,
      TransactionTypesConstant.withdrawal,
    ];
  }
}
