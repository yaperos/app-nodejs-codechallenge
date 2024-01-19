import { PaginatedBaseOutput } from 'src/modules/shared/application/dtos/paginated-base.output';
import { BaseResponseDto } from 'src/modules/shared/infrastructure/dtos/base-response.dto';
import { TransactionOutput } from 'src/modules/transaction/application/dtos/transaction.output';

interface PaginatedTransactionsData extends PaginatedBaseOutput {
  items: Array<TransactionOutput>;
}

export class PaginatedTransactionsResponseDto extends BaseResponseDto {
  data: PaginatedTransactionsData;
}
