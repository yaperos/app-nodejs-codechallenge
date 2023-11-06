import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsUUID, Min } from 'class-validator';
import { TransferType } from 'src/domain/models';

@ObjectType()
@InputType()
export class CreateTransactionInput {
  @Field()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field()
  @IsUUID()
  accountExternalIdCredit: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
  @Field(type => TransferType)
  tranferTypeId: TransferType;

  @Field()
  @Min(0)
  value: number;
}

registerEnumType(TransferType, {
  name: 'TransferType',
  description: 'the transfer types!',
});
