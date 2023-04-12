import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';

@Schema({
  collection: 'users_balance',
  timestamps: true,
})
export class balanceModel {
  @Prop({
    type: String,
    default: () => randomUUID(),
  })
  _id: string;

  @Prop({
    type: String,
  })
  userID: string;

  @Prop({
    type: Number,
  })
  currentBalance: number;

  @Prop({
    type: Date,
  })
  created_at: Date;

  @Prop({
    type: Date,
  })
  updated_at: Date;
}

export type balanceDocument = balanceModel & Document;

export const balanceSchema = SchemaFactory.createForClass(balanceModel);
