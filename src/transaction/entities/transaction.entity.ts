export class TransactionEntity {
  id!: number;
  transactionExternalId!: string;
  accountExternalIdDebit!: string;
  accountExternalIdCredit!: string;
  transferTypeId!: number;
  value!: number;
  status!: 'pendiente' | 'aprobado' | 'rechazado';
  createdAt!: Date;
}
