import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsNotEmpty({ message: 'Property $property is mandatory' })
  @IsUUID(4, { message: 'Property $property should be a UUID v4' })
  accountExternalIdDebit: string;

  @Field()
  @IsNotEmpty({ message: 'Property $property is mandatory' })
  @IsUUID(4, { message: 'Property $property should be a UUID v4' })
  accountExternalIdCredit: string;

  @Field()
  @IsNotEmpty({ message: 'Property $property is mandatory' })
  @IsPositive({ message: 'Property $property should be a positive number' })
  transactionTypeId: number;

  @Field()
  @IsNotEmpty({ message: 'Property $property is mandatory' })
  @IsPositive({ message: 'Property $property should be a positive number' })
  value: number;
}
