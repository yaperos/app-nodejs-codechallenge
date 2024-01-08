import {TransactionService} from "../services/transaction.service";
import {TransactionDto} from "../../domain/dto/transactionDto";

export class CreateTransactionHandler {

    private readonly service: TransactionService;

    constructor() {
        this.service = new TransactionService();
    }

    async handler(input: any): Promise<TransactionDto> {

        const transaction = await this.service.createTransaction(input);

        return {
            transactionExternalId: transaction.id,
            accountExternalIdDebit: transaction.accountExternalIdDebit,
            accountExternalIdCredit: transaction.accountExternalIdCredit,
            value: transaction.value,
            createdAt: transaction.createdAt,
            transactionType: {name: transaction.getTransactionTypeName()},
            transactionStatus: {name: transaction.status},
        };
    }

}