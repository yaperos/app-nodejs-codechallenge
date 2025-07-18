import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TransactionTypeResponseDto {
  @ApiProperty({
    name: 'code',
    description: 'Código del tipo de transacción',
    example: '220',
    required: false
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    name: 'description',
    description: 'Descripción del tipo de transacción',
    example: 'Transferencia bancaria',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  constructor(code?: string, description?: string) {
    this.code = code;
    this.description = description;
  }
}

export class TransactionStatusResponseDto {
  @ApiProperty({
    name: 'status',
    description: 'Estado de la transacción',
    example: 'COMPLETED',
    required: false
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    name: 'description',
    description: 'Descripción del estado',
    example: 'Transacción completada exitosamente',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  constructor(status?: string, description?: string) {
    this.status = status;
    this.description = description;
  }
}
