import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTransactionVerifyDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    name: 'accountExternalIdDebit',
    type: 'string',
    required: true,
    description: 'Id',
    example: 'd5ae4c6e-7a27-4bea-89d1-58e8ee42a591',
  })
  readonly accountExternalIdDebit: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    name: 'accountExternalIdCredit',
    type: 'string',
    required: true,
    description: 'Id',
    example: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
  })
  readonly accountExternalIdCredit: string;

  @IsNumber()
  @ApiProperty({
    name: 'transferTypeId',
    type: 'number',
    required: true,
    description: 'type transfer id',
    example: 1,
  })
  readonly transferTypeId: number;

  @IsNumber()
  @ApiProperty({
    name: 'value',
    type: 'number',
    required: true,
    description: 'Value to be validate',
    example: 1000,
  })
  readonly value: number;
}
