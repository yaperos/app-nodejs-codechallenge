import { IsNumber,  } from 'class-validator';
import {
  Expose,
  Type,
} from 'class-transformer';

export class GetPendingTransactionReq  {
    @IsNumber()
    readonly transactionId: number;
}
  
  
export class GetPendingTransactionMessageDTO  {
  @Expose()
  @Type(() => GetPendingTransactionReq)
  value: GetPendingTransactionReq;
}