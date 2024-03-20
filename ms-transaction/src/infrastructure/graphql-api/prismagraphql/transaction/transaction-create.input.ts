import { Field, InputType } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { TransferStatus } from '../prisma/transfer-status.enum';
import { TransferType } from '../prisma/transfer-type.enum';

@InputType()
export class TransactionCreateInput {
  @Field(() => String, { nullable: false, defaultValue: uuidv4() })
  externalId!: string;

  @Field(() => String, { nullable: false })
  accountExternalName!: string;

  @Field(() => TransferType, { nullable: false })
  transferTypeName!: keyof typeof TransferType;

  @Field(() => Number, { nullable: false })
  amount!: number;

  @Field(() => TransferStatus, {
    nullable: false,
    defaultValue: TransferStatus.PENDING,
  })
  status?: keyof typeof TransferStatus;

  @Field(() => Date, { nullable: false, defaultValue: new Date() })
  createdAt?: Date;
}
