import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class GetTransactionArgs {
  @Field({ description: 'The transaction GUID' })
  @IsString()
  transactionExternalId: string;
}
