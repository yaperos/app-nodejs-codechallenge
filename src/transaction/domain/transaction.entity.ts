import { TransactionStatusVo } from './value-objects/transaction-status.vo.js';

export class TransactionEntity {
  private constructor(
    readonly id: number,
    readonly transactionExternalId: string,
    readonly accountExternalIdDebit: string,
    readonly accountExternalIdCredit: string,
    readonly transferTypeId: number,
    readonly value: number,
    private status: TransactionStatusVo,
    readonly createdAt: Date,
  ) {}

  static createPending(props: {
    id: number;
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    createdAt: Date;
  }): TransactionEntity {
    return new TransactionEntity(
      props.id,
      props.transactionExternalId,
      props.accountExternalIdDebit,
      props.accountExternalIdCredit,
      props.transferTypeId,
      props.value,
      TransactionStatusVo.pending(),
      props.createdAt,
    );
  }

  static rehydrate(props: {
    id: number;
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    status: string;
    createdAt: Date;
  }): TransactionEntity {
    return new TransactionEntity(
      props.id,
      props.transactionExternalId,
      props.accountExternalIdDebit,
      props.accountExternalIdCredit,
      props.transferTypeId,
      props.value,
      TransactionStatusVo.from(props.status),
      props.createdAt,
    );
  }

  applyFraudDecision(next: 'approved' | 'rejected'): void {
    if (this.status.isFinal()) {
      return;
    }
    this.status = TransactionStatusVo.from(next);
  }

  getStatusName(): string {
    return this.status.toString();
  }
}
