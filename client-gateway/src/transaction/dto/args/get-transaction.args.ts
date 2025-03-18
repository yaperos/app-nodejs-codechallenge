import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

@ArgsType()
export class GetTransactionArgs {
  // "transactionExternalId": "Guid",
  @Field(() => String)
  @IsUUID()
  transactionExternalId: UUID;

//   // "transactionType": {
//   //   "name": ""
//   // },
//   @Field(() => GetTransactionTypeArgs)
//   transactionType: GetTransactionTypeArgs;

//   // "transactionStatus": {
//   //   "name": ""
//   // },
//   @
//   transactionStatus: GetTransactionStatusArgs;

//   // "value": 120,
//   value: number;

//   // "createdAt": "Date"
//   createdAt: Date;
}

@ArgsType()
export class GetTransactionTypeArgs {
  id: UUID;
  name: string;
}

@ArgsType()
export class GetTransactionStatusArgs {
  id: UUID;
  name: string;
}
