import type { Replace } from 'src/shared/utils/replace';
import { v4 as uuidv4 } from 'uuid';
import type {
  ITransaction,
  TransferType,
} from '../interfaces/transaction.interface';
import { TransferStatus } from '../interfaces/transaction.interface';

export class TransactionEntity {
  private props: ITransaction;
  private _id: number;
  constructor(
    props: Replace<
      ITransaction,
      {
        externalId?: string;
        status?: TransferStatus;
        createdAt?: Date;
        updatedAt?: Date;
      }
    >,
    id?: number,
  ) {
    this._id = id;
    this.props = {
      ...props,
      externalId: props.externalId || uuidv4(),
      status: props.status || TransferStatus.PENDING,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || null,
    };
  }

  public toResponse() {
    return {
      id: this.id,
      externalId: this.externalId,
      amount: this.amount,
      transferTypeName: this.transferTypeName,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public get id(): number {
    return this._id;
  }

  public get externalId(): string {
    return this.props.externalId;
  }

  public set externalId(externalId: string) {
    this.props.externalId = externalId;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public set amount(amount: number) {
    this.props.amount = amount;
  }

  public get accountExternalName(): string {
    return this.props.accountExternalName;
  }

  public set accountExternalName(accountExternalName: string) {
    this.props.accountExternalName = accountExternalName;
  }

  public get transferTypeName(): TransferType {
    return this.props.transferTypeName;
  }

  public set transferTypeName(transferTypeName: TransferType) {
    this.props.transferTypeName = transferTypeName;
  }

  public get status(): TransferStatus {
    return this.props.status;
  }

  public set status(status: TransferStatus) {
    this.props.status = status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
