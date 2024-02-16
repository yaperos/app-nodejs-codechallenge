import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ArgsType()
export class FindTransactionDto {
  @Field()
  @IsNotEmpty({ message: 'Property $property is mandatory' })
  @IsUUID(4, { message: 'Property $property should be a UUID v4' })
  transactionExternalId: string;
}
