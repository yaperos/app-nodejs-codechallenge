import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MessageStatusEnum } from 'src/enum/message-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class Transaction extends Document {
	@Prop({ required: false, default: uuidv4() })
	accountExternalIdDebit: string;

	@Prop({ required: false, default: uuidv4() })
	accountExternalIdCredit: string;

	@Prop({ required: false, default: uuidv4() })
	transactionExternalId: string;

	@Prop({ required: true, default: MessageStatusEnum.PENDING })
	transactionStatus: MessageStatusEnum;

	@Prop({ required: true })
	tranferTypeId: number;

	@Prop({ required: true })
	value: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
