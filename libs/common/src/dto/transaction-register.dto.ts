import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@InputType()
export class TransactionRegisterDto {
  @Field(() => String, { description: 'iddebito' })
  accountExternalIdDebit: string;

  @Field(() => String, { description: 'id credito' })
  accountExternalIdCredit: string;

  @Field(() => Int, { description: 'tipo transferencia' })
  @IsNumber()
  tranferTypeId: number;

  @Field(() => Float, { description: 'valor a transferir' })
  @IsPositive()
  value: number;

  transactionExternalId: string;

  transactionStatusId: number;
}
