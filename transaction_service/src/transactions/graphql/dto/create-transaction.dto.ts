import { InputType, Field, Int, Float, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsUUID, Min, IsInt, MaxLength, Matches } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => ID, { description: 'ID externo de la cuenta débito (Formato IBAN PE)' })
  @IsNotEmpty({ message: 'accountExternalIdDebit no debe estar vacío' })
  @IsUUID('4', { message: 'accountExternalIdDebit debe ser un UUID válido' })
  accountExternalIdDebit: string;

  @Field(() => ID, { description: 'ID externo de la cuenta crédito (Formato IBAN PE)' })
  @IsNotEmpty({ message: 'accountExternalIdCredit no debe estar vacío' })
  @IsUUID('4', { message: 'accountExternalIdCredit debe ser un UUID válido' })
  accountExternalIdCredit: string;

  @Field(() => Int, { description: 'Identificador numérico del tipo de transferencia' })
  @IsNotEmpty({ message: 'transferTypeId no debe estar vacío' })
  @IsInt({ message: 'transferTypeId debe ser un entero' })
  @Min(1, { message: 'transferTypeId debe ser al menos 1' })
  transferTypeId: number;

  @Field(() => Float, { description: 'Valor monetario de la transacción (máx 2 decimales)' })
  @IsNotEmpty({ message: 'value no debe estar vacío' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El valor debe ser numérico con hasta 2 decimales' })
  @Min(0.01, { message: 'El valor debe ser mayor a 0' })
  value: number;
}