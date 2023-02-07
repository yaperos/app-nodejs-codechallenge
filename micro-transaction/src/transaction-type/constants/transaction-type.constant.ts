export abstract class TransactionTypesConstant {
  static readonly tableName = 'transaction_types';
  static readonly transfer = {
    id_transaction_type: 1,
    name: 'Transferencia',
    key: 'transfer',
    description: 'Transferencia de Fondos.',
  };
  static readonly withdrawal = {
    id_transaction_type: 2,
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
