import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { EnumStatus, ITransaction } from './../models';

@Schema({ timestamps: true })
export class TransactionEntity implements ITransaction {
  @Prop()
  transactionExternalId: string;

  @Prop()
  tranferTypeId: number;

  @Prop(
    raw({
      name: {
        type: String,
        enum: EnumStatus,
        default: EnumStatus.pending,
      },
    }),
  )
  transactionStatus: Record<string, EnumStatus>;

  @Prop()
  value: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const TransactionSchema =
  SchemaFactory.createForClass(TransactionEntity);
