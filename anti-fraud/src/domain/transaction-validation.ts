export enum TransactionStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export class TransactionValidationModel {
  public id: string;
  public transferTypeId: number;
  public value: number;
  public status: TransactionStatus;
  public accountExternalIdDebit: string;
  public accountExternalIdCredit: string;
  public createdAt: Date;

  private MAX_VALID_TRANSACTION_AMOUNT = 1000;

  constructor(props: Partial<TransactionValidationModel>) {
    this.id = props.id;
    this.transferTypeId = props.transferTypeId;
    this.value = props.value;
    this.status = props.status;
    this.accountExternalIdDebit = props.accountExternalIdDebit;
    this.accountExternalIdCredit = props.accountExternalIdCredit;
    this.createdAt = props.createdAt;
  }

  public setTransactionStatusByAmount(): void {
    this.value <= this.MAX_VALID_TRANSACTION_AMOUNT
      ? (this.status = TransactionStatus.approved)
      : (this.status = TransactionStatus.rejected);
  }
}
