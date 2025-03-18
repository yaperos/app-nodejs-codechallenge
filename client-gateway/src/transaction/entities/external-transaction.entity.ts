import { ObjectType, Field, Float } from '@nestjs/graphql';
import { MasterTable } from './master-table.entity';
import { ExternalCreditAccount } from './external-credit-account.entity';
import { ExternalDebitAccount } from './external-debit-account.entity';

@ObjectType()
export class ExternalTransaction {
  @Field(() => String)
  id: string;

  @Field(() => ExternalDebitAccount)
  externalDebitAccount: ExternalDebitAccount;

  @Field(() => ExternalCreditAccount)
  externalCreditAccount: ExternalCreditAccount;

  @Field(() => MasterTable)
  type: MasterTable;

  @Field(() => MasterTable)
  status: MasterTable;

  @Field(() => MasterTable)
  transferType: MasterTable;

  @Field(() => Float)
  value: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
