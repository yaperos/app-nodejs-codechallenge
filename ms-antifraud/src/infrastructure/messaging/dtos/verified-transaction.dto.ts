import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TransferStatus } from '../../../domain/interfaces/transaction.interface';

export class VerifiedTransactionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly externalId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(TransferStatus, { each: true })
  readonly status: TransferStatus;
}
