mport { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

// DTO (Data Transfer Object) para verificar transacciones
export class CheckTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly transactionExternalId: string; // Identificador externo de la transacción

  @IsNumber()
  @IsNotEmpty()
  readonly value: number; // Valor de la transacción
}
