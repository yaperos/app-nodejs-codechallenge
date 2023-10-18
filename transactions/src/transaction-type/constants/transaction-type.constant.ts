import { TransactionTypesIdsEnum } from './transaction-types-ids.enum';

export abstract class TransactionTypesConstant {
  static readonly tableName = 'transaction_types';
  static readonly transfer = {
    transaction_type_id: TransactionTypesIdsEnum.transferId,
    name: 'Transferencia',
    key: 'transfer',
    description: 'Transferencia de Fondos.',
  };
  static readonly withdrawal = {
    transaction_type_id: TransactionTypesIdsEnum.withdrawal,
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
