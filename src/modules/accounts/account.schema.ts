import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/@base/base.entity';
import { uuid } from 'uuidv4';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account extends BaseEntity {
  @Prop({ required: false, default: uuid() })
  accountExternalId: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: false, default: 0 })
  balance: number;

  @Prop({ required: false, default: 'PEN' })
  currency: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);