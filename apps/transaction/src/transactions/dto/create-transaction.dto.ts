import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsUUID,
  Max,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

// Límite de negocio: mantiene el monto muy por debajo de la precisión segura de un double.
export const MAX_TRANSACTION_VALUE = 1_000_000_000;

function IsNotEqualTo(property: string, options?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isNotEqualTo',
      constraints: [property],
      validator: {
        validate: (value, args) =>
          value !== (args?.object as Record<string, unknown>)[property],
        defaultMessage: (args) =>
          `${args?.property} must be different from ${property}`,
      },
    },
    options,
  );
}

export class CreateTransactionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  accountExternalIdDebit!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEqualTo('accountExternalIdDebit')
  accountExternalIdCredit!: string;

  // El typo "tranferTypeId" es el contrato del README y se respeta tal cual.
  @ApiProperty({
    example: 1,
    description: 'Spelled as in the challenge contract',
  })
  @IsInt()
  @IsPositive()
  tranferTypeId!: number;

  @ApiProperty({ example: 120, maximum: MAX_TRANSACTION_VALUE })
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @IsPositive()
  @Max(MAX_TRANSACTION_VALUE)
  value!: number;
}
