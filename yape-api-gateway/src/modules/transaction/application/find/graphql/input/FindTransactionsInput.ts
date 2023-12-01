import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PaginatedInputBase } from 'src/Shared/adapters/base/PaginatedInputBase';
import { IPaginated } from 'src/Shared/adapters/interfaces/Paginated';

export interface IFindTransactions extends IPaginated {
  status?: number;
}

@ArgsType()
@InputType()
export class FindTransactionsInput
  extends PaginatedInputBase
  implements IFindTransactions
{
  @Field({ nullable: true })
  status?: number;
}
