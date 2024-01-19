import { BaseResponseDto } from 'src/modules/shared/infrastructure/dtos/base-response.dto';
import { ITransactionOutput as TransactionOutput } from 'src/modules/transaction/application/dtos/transaction.output';

export class TransactionResponseDto extends BaseResponseDto {
  data: TransactionOutput;
}
