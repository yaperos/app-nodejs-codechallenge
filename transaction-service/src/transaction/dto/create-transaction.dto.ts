import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'guid', description: 'account external id debit' })
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'guid', description: 'account external id credit' })
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @ApiProperty({ example: '1', description: 'tranfer type id' })
  tranferTypeId: number;

  @IsNotEmpty()
  @ApiProperty({ example: '120', description: 'amount' })
  value: number;
}
