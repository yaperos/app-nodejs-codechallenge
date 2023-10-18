import { Expose, Transform } from 'class-transformer';
import { TransactionStatusConstant } from '../../transaction-status/constants/transaction-status.constant';
import { TransactionTypesConstant } from '../../transaction-type/constants/transaction-type.constant';
import { Transaction } from '../entities/transaction.entity';

// @Expose()
// export class GetTransactionDto {
//   @Expose({ name: 'transactionExternalId' })
//   transaction_external_id: number;
//
//   @Expose({ name: 'transactionType' })
//   @Transform(
//     ({ value }) => {
//       const name = TransactionTypesConstant.getListTransactionsTypes().find(
//         (ts) => ts.transaction_type_id == value,
//       )?.name;
//       if (!name) throw new Error('No se pudo mapear transaction type');
//       return { name };
//     },
//     { toClassOnly: true },
//   )
//   transaction_type_id: number;
//
//   @Expose({ name: 'transactionStatus' })
//   @Transform(
//     ({ value }) => {
//       const name = TransactionStatusConstant.getListStatus().find(
//         (ts) => ts.transaction_status_id == value,
//       )?.name;
//       if (!name) throw new Error('No se pudo mapear el status id');
//       return { name };
//     },
//     { toClassOnly: true },
//   )
//   transaction_status_id: number;
//
//   @Expose()
//   value: number;
//
//   @Expose({ name: 'createdAt' })
//   created_at: Date;
// }

export class GetTransactionDtoV2 {
  transactionExternalId: string;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: Date;

  static fromTransaction(transaction: Transaction) {
    const transactionType =
      TransactionTypesConstant.getListTransactionsTypes().find(
        (ts) => ts.transaction_type_id == transaction.transaction_type_id,
      );
    if (!transactionType) throw new Error('No se pudo mapear transaction type');

    const transactionStatus = TransactionStatusConstant.getListStatus().find(
      (ts) => ts.transaction_status_id == transaction.transaction_status_id,
    );
    if (!transactionStatus) throw new Error('No se pudo mapear el status id');

    const data: GetTransactionDtoV2 = {
      transactionExternalId: transaction.transaction_external_id,
      transactionType: {
        name: transactionType.name,
      },
      transactionStatus: {
        name: transactionStatus.name,
      },
      value: transaction.value,
      createdAt: transaction.created_at,
    };
    return data;
  }
}
