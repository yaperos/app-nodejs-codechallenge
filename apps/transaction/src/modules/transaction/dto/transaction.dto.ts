import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionResponseDto {
  @Field(() => String, { description: 'Id' })
  id: string;

  @Field(() => String, { description: 'Id externo debito' })
  accountExternalIdDebit: string;

  @Field(() => String, { description: 'Id externo credito' })
  accountExternalIdCredit: string;

  @Field(() => Int, { description: 'Id transferencia' })
  tranferTypeId: number;

  @Field(() => Float, { description: 'Valor transaccional' })
  value: number;

  @Field(() => String, { description: 'Id externo' })
  transactionExternalId?: string;

  transactionStatusId: number;
}

@ObjectType()
export class TransactionSearchResponseDto {
  @Field(() => String, { description: 'Id externo' })
  transactionExternalId?: string;

  @Field(() => String, { description: 'Tipo de transaccion' })
  transactionType?: string;

  @Field(() => String, { description: 'Estado de transaccion' })
  transactionStatus?: string;

  @Field(() => Float, { description: 'Valor transaccional' })
  value?: number;

  @Field(() => Date, { description: 'Fecha de creacion' })
  createdAt?: Date;
}

@InputType()
class TransactionTypeInput {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
class TransactionStatusInput {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class TransactionSearchRequestDto {
  @Field({ nullable: true })
  transactionExternalId?: string;

  @Field(() => TransactionTypeInput, { nullable: true })
  transactionType?: TransactionTypeInput;

  @Field(() => TransactionStatusInput, { nullable: true })
  transactionStatus?: TransactionStatusInput;

  @Field({ nullable: true })
  value?: number;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}
