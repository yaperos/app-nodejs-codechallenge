import {
  AggregateRoot,
  Guard,
  IGuardArgument,
  Result,
  UniqueEntityID,
} from 'clean-common-lib';
import { Guid } from './Guid';
import { TransactionValue } from './TransactionValue';
import { TransactionExternalCreatedEvent } from './events';

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TransactionType {
  NONE,
  YAPE,
}

export interface TransactionExternalProps {
  accountExternalIdDebit: Guid;
  accountExternalIdCredit: Guid;
  type: TransactionType;
  value: TransactionValue;
  status?: TransactionStatus;
  createAt?: Date;
}

export class TransactionExternal extends AggregateRoot<TransactionExternalProps> {
  get accountExternalIdDebit(): Guid {
    return this.props.accountExternalIdDebit;
  }

  get accountExternalIdCredit(): Guid {
    return this.props.accountExternalIdCredit;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get value(): TransactionValue {
    return this.props.value;
  }

  get createAt(): Date | undefined {
    return this.props.createAt;
  }

  get status(): TransactionStatus | undefined {
    return this.props.status;
  }

  updateStatus(status: TransactionStatus) {
    this.props.status = status;
  }

  public static create(
    props: TransactionExternalProps,
    id?: UniqueEntityID
  ): Result<TransactionExternal> {
    const guardArgs: IGuardArgument[] = [
      {
        argument: props.accountExternalIdDebit,
        argumentName: 'accountExternalIdDebit',
      },
      {
        argument: props.accountExternalIdCredit,
        argumentName: 'accountExternalIdCredit',
      },
      { argument: props.type, argumentName: 'type' },
      { argument: props.value, argumentName: 'value' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<TransactionExternal>(guardResult.getErrorValue());
    }

    const defaultValues: TransactionExternalProps = {
      ...props,
      createAt: props.createAt ? props.createAt : new Date(),
      status: props.status ? props.status : TransactionStatus.PENDING,
    };

    const isNewTransactionExternal = !!id === false;
    const transactionExternal = new TransactionExternal(defaultValues, id);

    if (isNewTransactionExternal) {
      transactionExternal.addDomainEvent(
        new TransactionExternalCreatedEvent(transactionExternal)
      );
    }

    return Result.ok<TransactionExternal>(transactionExternal);
  }
}
