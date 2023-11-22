import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionArgs {
  @Field()
  // ... otros campos de la transacción
  value: number;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: string;
}
