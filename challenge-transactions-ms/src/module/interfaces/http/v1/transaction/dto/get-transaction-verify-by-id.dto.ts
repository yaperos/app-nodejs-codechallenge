import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class GetTransactionVerifyDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    name: 'transactionExternalId',
    type: 'string',
    required: true,
    description: 'Id Transaction external',
    example: 'd5ae4c6e-7a27-4bea-89d1-58e8ee42a591',
  })
  readonly transactionExternalId: string;
}
