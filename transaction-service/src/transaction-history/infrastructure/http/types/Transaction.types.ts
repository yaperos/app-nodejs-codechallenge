import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionCreate {
  @ApiProperty({
    example: '1001bcbc032bc032bc0',
  })
  @IsString()
  @IsNotEmpty()
  readonly accountExternalIdDebit: string;

  @ApiProperty({
    example: '23nfnnnc-32hc2c2h-3b3',
  })
  @IsString()
  @IsNotEmpty()
  readonly accountExternalIdCredit: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly transferTypeId: number;

  @ApiProperty({
    example: 120,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly value: number;
}
