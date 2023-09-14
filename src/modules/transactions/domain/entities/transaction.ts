import { StatusTransactions } from '../enums/status.enum';
import { TransactionCreated } from '../events/transaction-created';
import { Identifier } from '../value-objects/identifier';
import { AggregateRoot } from './aggregate-root';

export class Transaction extends AggregateRoot {
  private _accountExternalIdDebit: string;
  private _accountExternalIdCredit: string;
  private _tranferTypeId: number;
  private _status: StatusTransactions;
  private _value: number;

  constructor(
    id?: Identifier,
    accountExternalIdDebit?: string,
    accountExternalIdCredit?: string,
    tranferTypeId?: number,
    value?: number,
  ) {
    super(id);
    if (
      id &&
      accountExternalIdDebit &&
      accountExternalIdCredit &&
      tranferTypeId &&
      value
    ) {
      this._accountExternalIdDebit = accountExternalIdDebit;
      this._accountExternalIdCredit = accountExternalIdCredit;
      this._tranferTypeId = tranferTypeId;
      this._value = value;
      this._status = StatusTransactions.PENDING;
      this.addDomainEvent(new TransactionCreated(this));
    }
  }
  get accountExternalIdDebit(): string {
    return this._accountExternalIdDebit;
  }

  get accountExternalIdCredit(): string {
    return this._accountExternalIdCredit;
  }

  get value(): number {
    return this._value;
  }

  get tranferTypeId(): number {
    return this._tranferTypeId;
  }

  get status(): StatusTransactions {
    return this._status;
  }

  public plain(): Record<string, any> {
    return {
      id: this.id.toString(),
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
      status: this.status,
    };
  }

  public hydrate(root): Transaction {
    this._id = root.id;
    this._accountExternalIdDebit = root.accountExternalIdDebit;
    this._accountExternalIdCredit = root.accountExternalIdCredit;
    this._tranferTypeId = root.tranferTypeId;
    this._value = root.value;
    this._status = root.status;

    return this;
  }
}
