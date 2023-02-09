import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
class GetTransactionArgs {
  @Field({ description: 'The transaction GUID' })
  @IsString()
  transactionExternalId: string;
}

export default GetTransactionArgs;
