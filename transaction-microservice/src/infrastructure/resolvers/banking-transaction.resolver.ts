import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BankingTransaction } from "../entities/banking-transaction.entity";
import { BankingTransactionService } from "../services/banking-transaction.service";
import { CreateBankingTransactionInput } from "src/domain/models/inputs/create-banking-transaction";
import { UpdateBankingTransactionInput } from "src/domain/models/inputs/update-banking-transaction";

@Resolver(()=>BankingTransaction)
export class BankingTransactionResolver {
  constructor(private readonly service: BankingTransactionService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(()=> BankingTransaction)
  async createBankingTransaction(@Args('createBankingTransactionInput') createBankingTransactionInput: CreateBankingTransactionInput): Promise<BankingTransaction> {
    const result = await this.service.saveTransaction(createBankingTransactionInput);
    return result;
  }

  @Mutation(()=> BankingTransaction)
  async updateBankingTransaction(@Args('updateBankingTransactionInput') updateBankingTransactionInput: UpdateBankingTransactionInput): Promise<BankingTransaction> {
    const result = await this.service.updateTransaction(updateBankingTransactionInput);
    return result;
  }

}