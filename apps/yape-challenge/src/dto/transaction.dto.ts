import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransaccionDto {
  @IsNotEmpty({ message: 'accountExternalIdDebit is required' })
  @IsString()
  accountExternalIdDebit: string;

  @IsNotEmpty({ message: 'accountExternalIdCredit is required' })
  @IsString()
  accountExternalIdCredit: string;

  @IsNotEmpty({ message: 'tranferTypeId is required' })
  @IsNumber()
  tranferTypeId: number;

  @IsNotEmpty({ message: 'value is required' })
  @IsNumber()
  value: number;
}
