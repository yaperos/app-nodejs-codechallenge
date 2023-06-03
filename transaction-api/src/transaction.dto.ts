import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { GraphQLID } from 'graphql';

@InputType()
export class CreateTransactionInput {
  @Field((type) => GraphQLID)
  accountExternalIdDebit: string;

  @Field((type) => GraphQLID)
  accountExternalIdCredit: string;

  @Field()
  transferTypeId: number;

  @Field()
  value: number;
}

export type UpdateTransactionStatusEventPayload = {
  transactionExternalId: string;
  data: { status: string };
};

export type TransactionDBEventPayload =
  | {
      operation: 'create';
      data: Prisma.TransactionCreateInput;
    }
  | {
      operation: 'update';
      where: Prisma.TransactionWhereUniqueInput;
      data: Prisma.TransactionUpdateInput;
    };

@ObjectType({ description: 'transactionType' })
class TranscriptionType {
  @Field()
  name: number;
}

@ObjectType({ description: 'transactionStatus' })
class TransactionStatus {
  @Field()
  name: string;
}

@ObjectType({ description: 'transaction' })
export class TransactionObject {
  @Field((type) => ID)
  transactionExternalId: string;

  @Field((type) => TranscriptionType)
  transactionType: TranscriptionType;

  @Field((type) => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field()
  value: number;

  @Field()
  createdAt: Date;
}

@ObjectType({ description: 'transaction' })
export class CreateTransactionObject {
  @Field((type) => ID)
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field({ nullable: true })
  accountExternalIdCredit?: string;

  @Field()
  transferTypeId: number;

  @Field()
  value: number;

  @Field()
  status: string;
}
