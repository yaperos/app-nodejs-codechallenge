import { ArgsType, Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionStatus, TransactionType } from 'src/models/enums';

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@InputType()
export class TransactionTypeRequest {
  @Field(() => TransactionType)
  name: TransactionType;
}

@InputType()
export class TransactionStatusRequest {
  @Field(() => TransactionStatus)
  name: TransactionStatus;
}

@ArgsType()
export class TransferRequest {
  @Field({ nullable: true })
  transferExternalId: string;

  @Field(() => TransactionTypeRequest, { nullable: true })
  transactionType: TransactionTypeRequest;

  @Field(() => TransactionStatusRequest ,{ nullable: true })
  transactionStatus: TransactionStatusRequest;

  @Field({ nullable: true})
  value: number;

  @Field({ nullable: true})
  createdAt: Date;
}


