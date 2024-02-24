import { IsIn, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
[]
export class TransactionCreateRequest {
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string = undefined;
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string = undefined;
  
  @IsNotEmpty()
  @IsNumber()
  @IsIn([1,2])
  tranferTypeId: number = undefined;
  @IsNotEmpty()
  @IsNumber()
  value: number = undefined;
}
