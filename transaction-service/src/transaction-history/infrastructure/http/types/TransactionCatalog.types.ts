import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionCatalogCreate {
  @ApiProperty({
    example: 'CREDIT',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
