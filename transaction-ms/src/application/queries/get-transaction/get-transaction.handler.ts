import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransactionQuery } from "./get-transaction.query";
import { toTransactionView, TransactionView } from "../../dtos/transaction.view";
import { TransactionRepositoryPort } from "../../../domain/ports/transaction.repository.port";
import { TransactionCachePort } from "../../ports/transaction-cache.port";
import { TransactionNotFoundError } from "../../../domain/errors/domain.errors";
import { TransactionStatus } from "../../../domain/enum/transaction-status.enum";


const PENDING_TTL_SECONDS = 5;
const FINAL_TTL_SECONDS = 60 * 60;

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery, TransactionView> {

    constructor(
        private readonly repository: TransactionRepositoryPort,
        private readonly cache: TransactionCachePort
    ) { }

    async execute(query: GetTransactionQuery): Promise<TransactionView> {
        const cached = await this.cache.get(query.transactionExternalId);

        if (cached) return cached;

        const transaction = await this.repository.findById(query.transactionExternalId);

        if (!transaction)
            throw new TransactionNotFoundError(query.transactionExternalId);

        const view = toTransactionView(transaction)

        const ttl = transaction.status === TransactionStatus.PENDING ? PENDING_TTL_SECONDS : FINAL_TTL_SECONDS;

        await this.cache.set(view, ttl)

        return view;

    }

}