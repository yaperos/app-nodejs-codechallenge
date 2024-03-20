import { Field, InputType } from '@nestjs/graphql';
import { TransferStatus } from './transfer-status.enum';

@InputType()
export class EnumStatusFieldUpdateOperationsInput {
  @Field(() => TransferStatus, { nullable: true })
  set?: keyof typeof TransferStatus;
}
