import { Observer } from '../Observer/transation.observer';

export interface ITransaction {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  transactionExternalId: string;
  transactionType: string;
  transactionStatus: string;
  createdAt?: Date;
}

export class Transaction implements ITransaction {
  private observers: Observer[] = [];
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  transactionExternalId: string;
  transactionType: string;
  transactionStatus: string;
  createdAt?: Date;

  constructor(transactionInfo: ITransaction) {
    this.accountExternalIdDebit = transactionInfo.accountExternalIdDebit;
    this.accountExternalIdCredit = transactionInfo.accountExternalIdCredit;
    this.tranferTypeId = transactionInfo.tranferTypeId;
    this.value = transactionInfo.value;
    this.transactionExternalId = transactionInfo.transactionExternalId;
    this.transactionType = transactionInfo.transactionType;
    this.transactionStatus = transactionInfo.transactionStatus;
  }

  public attach(observer: Observer): void {
    this.observers.push(observer);
  }
  
  public detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  public getStatus(): string {
    return this.transactionStatus;
  }

  public setStatus(status: string): void {
    this.transactionStatus = status;
    this.notify();
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}
