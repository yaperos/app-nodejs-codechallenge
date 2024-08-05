import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@InputType()
export class CreateTransactionRequest {
  @Field(() => String, { description: 'id debito' })
  accountExternalIdDebit: string;

  @Field(() => String, { description: 'id credito' })
  accountExternalIdCredit: string;

  @Field(() => Int, { description: 'tipo transacción' })
  @IsNumber()
  tranferTypeId: number;

  @Field(() => Float, { description: 'valor a transferir' })
  @IsPositive()
  value: number;
}
