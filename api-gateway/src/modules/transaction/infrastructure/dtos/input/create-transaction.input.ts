import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsUUID, Max, Min } from 'class-validator';
import { CreateTransactionInput as ICreateTransactionInput } from 'src/modules/transaction/domain/providers/transaction-client.provider';

const TRANSFER_TYPE_ID_RANGE_MESSAGE = 'Transfer type must be 1, 2 or 3';

@InputType({ description: 'Input used to create transaction' })
export class CreateTransactionInput implements ICreateTransactionInput {
  @Field(() => String, { description: 'Guid' })
  @IsUUID()
  readonly accountExternalIdCredit: string;

  @Field(() => String, { description: 'Guid' })
  @IsUUID()
  readonly accountExternalIdDebit: string;

  @Field(() => Int, { description: 'Tranfer type' })
  @IsNumber()
  @Min(1, { message: TRANSFER_TYPE_ID_RANGE_MESSAGE })
  @Max(3, { message: TRANSFER_TYPE_ID_RANGE_MESSAGE })
  readonly tranferTypeId: number;

  @Field(() => Float, { description: 'Amount value' })
  @IsNumber()
  @IsPositive()
  readonly value: number;
}
