import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { DTOCreateTransaction } from 'src/transaction/domain/dto.interface';

@InputType()
export class CreateTransactionInput implements DTOCreateTransaction{
  @IsNotEmpty()
  @Field()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @Field()
  accountExternalIdCredit: string;

  @IsNumber()
  @Field((type) => Int)
  tranferTypeId: number;

  @IsNumber()
  @Field((type) => Int)
  value: number;
}
