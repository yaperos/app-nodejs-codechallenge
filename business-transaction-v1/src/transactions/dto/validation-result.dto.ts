import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationResultDto {
  @ApiProperty({
    description: 'ID de la transacción a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsString()
  transactionId!: string;

  @ApiProperty({
    description: 'Indica si la transacción es fraudulenta',
    example: false
  })
  @IsBoolean()
  isFraudulent!: boolean;

  @ApiProperty({
    description: 'Razón del análisis de fraude',
    example: 'Transacción aprobada - patrones normales detectados',
    required: false
  })
  @IsOptional()
  @IsString()
  reason?: string;

 
  constructor();

  constructor(transactionId: string, isFraudulent: boolean, reason?: string);
 
  constructor(transactionId?: string, isFraudulent?: boolean, reason?: string) {
    if (transactionId) this.transactionId = transactionId;
    if (isFraudulent !== undefined) this.isFraudulent = isFraudulent;
    if (reason) this.reason = reason;
  }

  setTransactionId(transactionId: string): ValidationResultDto {
    this.transactionId = transactionId;
    return this;
  }

  setIsFraudulent(isFraudulent: boolean): ValidationResultDto {
    this.isFraudulent = isFraudulent;
    return this;
  }

  setReason(reason: string): ValidationResultDto {
    this.reason = reason;
    return this;
  }

  getTransactionId(): string {
    return this.transactionId;
  }

  getIsFraudulent(): boolean {
    return this.isFraudulent;
  }

  getReason(): string | undefined {
    return this.reason;
  }

  static builder(): ValidationResultDtoBuilder {
    return new ValidationResultDtoBuilder();
  }
}

export class ValidationResultDtoBuilder {
  private transactionId?: string;
  private isFraudulent?: boolean;
  private reason?: string;

  setTransactionId(transactionId: string): ValidationResultDtoBuilder {
    this.transactionId = transactionId;
    return this;
  }

  setIsFraudulent(isFraudulent: boolean): ValidationResultDtoBuilder {
    this.isFraudulent = isFraudulent;
    return this;
  }

  setReason(reason: string): ValidationResultDtoBuilder {
    this.reason = reason;
    return this;
  }

  build(): ValidationResultDto {
    const result = new ValidationResultDto();
    if (this.transactionId) result.transactionId = this.transactionId;
    if (this.isFraudulent !== undefined) result.isFraudulent = this.isFraudulent;
    if (this.reason) result.reason = this.reason;
    return result;
  }
}
