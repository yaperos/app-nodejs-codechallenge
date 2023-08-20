import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

// DTO (Data Transfer Object) para verificar transacciones
export class VerificarTransaccionRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly id: string; // Identificador externo de la transacción

  @IsNumber()
  @IsNotEmpty()
  readonly value: number; // Valor de la transacción
}
