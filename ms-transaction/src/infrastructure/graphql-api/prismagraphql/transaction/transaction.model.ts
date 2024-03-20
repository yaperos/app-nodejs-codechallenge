import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TransferStatus } from '../prisma/transfer-status.enum';
import { TransferType } from '../prisma/transfer-type.enum';
@ObjectType()
export class Transaction {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: false })
  externalId!: string;

  @Field(() => String, { nullable: false })
  accountExternalName!: string;

  @Field(() => TransferType, {
    nullable: false,
    defaultValue: TransferType.CREDIT,
  })
  transferTypeName!: keyof typeof TransferType;

  @Field(() => Number, { nullable: false })
  amount!: number;

  @Field(() => TransferStatus, {
    nullable: false,
    defaultValue: TransferStatus.PENDING,
  })
  status!: keyof typeof TransferStatus;

  @Field(() => Date, { nullable: false, defaultValue: new Date() })
  createdAt!: Date;

  @Field(() => Date || null, { nullable: false, defaultValue: null })
  updatedAt?: Date | null;
}
