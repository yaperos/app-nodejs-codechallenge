import { Field, InputType, Int } from '@nestjs/graphql';
import { AccountExternalNameEnum } from 'apps/api-gateway/src/transactions/enums/account-external.enum';
import { TransferNameEnum } from 'apps/api-gateway/src/transactions/enums/transfer-name.enum';
import { IsEnum, IsInt } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => Int)
  @IsInt()
  readonly amount: number;

  @Field(() => AccountExternalNameEnum)
  @IsEnum(AccountExternalNameEnum)
  readonly accountExternalName: AccountExternalNameEnum;

  @Field(() => TransferNameEnum)
  @IsEnum(TransferNameEnum)
  readonly transferName: TransferNameEnum;
}
