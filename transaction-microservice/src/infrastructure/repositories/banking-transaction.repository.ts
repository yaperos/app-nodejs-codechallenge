import { Injectable } from "@nestjs/common";
import { BankingTransaction } from "src/domain/models/banking-transaction";
import { BankingTransactionRepository } from "../../domain/repositories/banking-transactionRepository.interface";

@Injectable()
export class DatabaseBankingTransactionRepository implements BankingTransactionRepository {

    /*constructor(
      @InjectRepository(User)
      private readonly userEntityRepository: Repository<User>,
    ) {}*/

    save(transaction: BankingTransaction): Promise<BankingTransaction> {
        throw new Error("Method not implemented.");
    }
    update(transaction: BankingTransaction): Promise<BankingTransaction> {
        throw new Error("Method not implemented.");
    }
}