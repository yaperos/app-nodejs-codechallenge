import {
  AggregateRoot,
  Guard,
  IGuardArgument,
  Result,
  UniqueEntityID,
} from 'clean-common-lib';
import { Guid } from './Guid';
import { TransactionValue } from './TransactionValue';
import { TransactionExteternalCreated } from './events';

interface TransactionType {
  id: number;
  name: string;
}

export interface TransactionExternalProps {
  accountExternalIdDebit: Guid;
  accountExternalIdCredit: Guid;
  type: TransactionType;
  value: TransactionValue;
  createAt: Date;
}

export class TransactionExternal extends AggregateRoot<TransactionExternalProps> {
  get transactionExternalId(): Guid {
    return Guid.create(this._id).getValue();
  }

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

  get createAt(): Date {
    return this.props.createAt;
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
    };

    const isNewTransactionExternal = !!id === false;
    const transactionExternal = new TransactionExternal(defaultValues, id);

    if (isNewTransactionExternal) {
      transactionExternal.addDomainEvent(
        new TransactionExteternalCreated(transactionExternal)
      );
    }

    return Result.ok<TransactionExternal>(transactionExternal);
  }
}
