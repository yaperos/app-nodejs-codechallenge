import { LoggerService } from "@/config/logger/logger.service";
import { TracerService } from "@/config/tracer/tracer.service";
import { TransactionRepository } from "@/contexts/transaction/transaction.repository";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { TransactionRespDto } from "@/contexts/transaction/dto/transaction.dto";
import { transactionBuilder } from "@/contexts/transaction/transaction.builder";


@Resolver(() => TransactionRespDto)
export class TransactionResolver {
  constructor(
    private logger: LoggerService,
    private tracer: TracerService,
    private readonly transactionRepository: TransactionRepository,
  ) {  }

  @Query(() => [TransactionRespDto])
  async getTransaction(@Args('id') id: string): Promise<TransactionRespDto[]>  {
    const transaction = await this.transactionRepository.findData(id);
    return transaction.map(r => transactionBuilder(r));
  }
}
