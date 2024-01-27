import { IsNumber, IsNotEmpty ,IsString, IsInt} from 'class-validator';


export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt()
  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}