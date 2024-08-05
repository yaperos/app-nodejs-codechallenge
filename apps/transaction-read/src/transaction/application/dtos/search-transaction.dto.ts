import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
class TransactionType {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
class TransactionStatus {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class SearchTransactionRequest {
  @Field({ nullable: true })
  transactionExternalId?: string;

  @Field(() => TransactionType, { nullable: true })
  transactionType?: TransactionType;

  @Field(() => TransactionStatus, { nullable: true })
  transactionStatus?: TransactionStatus;

  @Field({ nullable: true })
  value?: number;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

@ObjectType()
export class SearchTransactionResponse {
  @Field(() => String, { description: 'Id externo' })
  transactionExternalId?: string;

  @Field(() => String, { description: 'Tipo de transaccion' })
  transactionType?: string;

  @Field(() => String, { description: 'Account External Id Debit' })
  accountExternalIdDebit?: string;

  @Field(() => String, { description: 'Account External Id Credit' })
  accountExternalIdCredit?: string;

  @Field(() => String, { description: 'Estado de transaccion' })
  transactionStatus?: string;

  @Field(() => Float, { description: 'Valor transaccional' })
  value?: number;

  @Field(() => Date, { description: 'Fecha de creacion', nullable: true })
  createdAt?: Date;
}
