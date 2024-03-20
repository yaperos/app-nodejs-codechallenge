import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { EnumStatusFieldUpdateOperationsInput } from '../prisma/enum-status-types-field-update-operations.input';

@InputType()
export class TransactionUpdateInput {
  @Field(() => EnumStatusFieldUpdateOperationsInput, { nullable: true })
  status?: EnumStatusFieldUpdateOperationsInput;

  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: DateTimeFieldUpdateOperationsInput;
}
