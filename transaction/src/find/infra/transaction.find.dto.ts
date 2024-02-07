import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class TransactionFindInputDto {
  @ApiProperty({ example: 'ef6990f2-7d00-43bd-880d-fbe6220f1e82' })
  @IsUUID()
  @IsNotEmpty()
  @Field()
  id: string;
}

@ObjectType()
export class FieldName {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionQuery {
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field((type) => FieldName)
  transactionType: { name: string };

  @Field((type) => FieldName)
  transactionStatus: { name: string };

  @Field()
  value: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}
