import {
  Transaction,
  TransactionTypeEnum,
} from 'src/shared/domain/transaction.model';
import { TransactionPostgres } from '../../create/infra/transaction.entity';
import { TransactionMongo } from '../../create/infra/transaction.mongo';
import { TransactionQuery } from 'src/find/infra/transaction.find.dto';

export class TransactionToMongo {
  static handle(input: Transaction): TransactionMongo {
    const primitive = input.toPrimitives();
    return {
      accountExternalIdCredit: primitive.accountExternalIdCredit,
      accountExternalIdDebit: primitive.accountExternalIdDebit,
      createdAt: primitive.createdAt,
      updateAt: primitive.updateAt,
      transactionStatus: { name: primitive.status },
      transactionType: {
        name: TransactionTypeEnum[primitive.transactionType.id],
      },
      value: primitive.value,
      _id: primitive.id,
    };
  }
}
export class TransactionMongoToDomain {
  static handle(input: TransactionMongo): Transaction {
    return Transaction.build({
      value: input.value,
      id: input._id,
      updateAt: input.updateAt,
      createdAt: input.createdAt,
      status: input.transactionStatus.name,
      accountExternalIdDebit: input.accountExternalIdDebit,
      accountExternalIdCredit: input.accountExternalIdCredit,
      transactionTypeId: TransactionTypeEnum[input.transactionType.name],
    });
  }
}

export class TransactionToPostgres {
  static handle(input: Transaction): TransactionPostgres {
    const primitive = input.toPrimitives();
    return {
      accountExternalIdCredit: primitive.accountExternalIdCredit,
      accountExternalIdDebit: primitive.accountExternalIdDebit,
      createdAt: primitive.createdAt,
      transactionId: primitive.id,
      status: primitive.status,
      transactionTypeId: primitive.transactionType.id,
      value: primitive.value,
      id: null,
    };
  }
}

export class TransactionToQueryResult {
  static handle(input: Transaction): TransactionQuery {
    const primitive = input.toPrimitives();
    return {
      transactionExternalId: primitive.id,
      accountExternalIdDebit: primitive.accountExternalIdDebit,
      accountExternalIdCredit: primitive.accountExternalIdCredit,
      createdAt: primitive.createdAt,
      updateAt: primitive.updateAt,
      transactionStatus: { name: primitive.status },
      transactionType: { name: primitive.transactionType.name },
      value: primitive.value,
    };
  }
}
