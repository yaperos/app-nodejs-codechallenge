import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Account, AccountStatus } from 'src/accounts/domain/entity/account';
import { MongoIdentification } from './mongo-identification';

@Schema({ collection: 'accounts', timestamps: true })
export class MongoAccount implements Account {
  @Prop({ required: true, unique: true, type: String })
  userId: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, unique: true, type: String })
  phone: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: MongoIdentification })
  identification: MongoIdentification;

  @Prop({ required: true, type: String, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, type: Date, default: Date.now })
  updatedAt: Date;
}

export const MongoAccountSchema = SchemaFactory.createForClass(MongoAccount);
