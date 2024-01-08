import {TransactionService} from "../../domain/services/transaction.service";
import {TransactionDto} from "../../domain/dto/transactionDto";

export class GetTransactionHandler {

    private readonly service: TransactionService;

    constructor() {
        this.service = new TransactionService();
    }

    async handler(id: string): Promise<TransactionDto> {

        const transaction = await this.service.getTransactionById(id);

        return {
            transactionExternalId: transaction?.id,
            accountExternalIdDebit: transaction?.accountExternalIdDebit,
            accountExternalIdCredit: transaction?.accountExternalIdCredit,
            value: transaction?.value,
            createdAt: transaction?.createdAt,
            transactionType: {name: transaction?.getTransactionTypeName()},
            transactionStatus: {name: transaction?.status},
        };
    }

}