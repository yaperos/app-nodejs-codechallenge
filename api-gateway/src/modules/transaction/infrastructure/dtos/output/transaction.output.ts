import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { TransactionOutput as ITransactionOutput } from 'src/modules/transaction/domain/providers/transaction-client.provider';

@ObjectType({ description: 'Transaction Type object' })
class TransactionTypeOutput {
  @Field(() => String)
  name: string;
}

@ObjectType({ description: 'Transaction Status object' })
class TransactionStatusOutput {
  @Field(() => String)
  name: string;
}

@ObjectType({ description: 'Transaction object' })
export class TransactionOutput implements ITransactionOutput {
  @Field(() => ID, { description: 'Guid' })
  transactionExternalId: string;

  @Field(() => TransactionTypeOutput)
  transactionType: TransactionTypeOutput;

  @Field(() => TransactionStatusOutput, { description: 'Guid' })
  transactionStatus: TransactionStatusOutput;

  @Field(() => Float, { description: 'amount' })
  value: number;

  @Field(() => String, { description: 'Date' })
  createdAt: string;
}
