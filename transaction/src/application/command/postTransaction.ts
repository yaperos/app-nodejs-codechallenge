import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ClientKafka } from "@nestjs/microservices";
import { Transaction } from "src/domain/transaction";
import { TransactionRepository } from "src/domain/transaction.repository";
import { TransactionInfrastructure } from "src/infrastructure/transaction.infrastructure";
import { TransactionPostDto } from "../dtos/transactionPost.dto";

export class PostTransactionCommand implements ICommand {
    constructor (
        public readonly accExternalIdDebit: string,
        public readonly accExternalIdCredit: string,
        public readonly transferTypeId: number,
        public readonly value: number
    ) {}
}

@CommandHandler(PostTransactionCommand)
export class PostTransactionCommandHandler implements ICommandHandler<PostTransactionCommand, any>{
    constructor(
        @Inject(TransactionInfrastructure)  
        private repository: TransactionRepository,
        @Inject('GENERATE_TRANSACTION') 
        private readonly clientKafka : ClientKafka
    ) {}

    async execute(command: PostTransactionCommand): Promise<any> {
        const {accExternalIdDebit,accExternalIdCredit, transferTypeId, value } = command;
        const tr = new Transaction({ accExternalIdDebit, accExternalIdCredit, transferTypeId, value });

        const repoTransactionStored = await this.repository.save(tr);
        const msg = JSON.stringify(
            {
                transactionExternalId: repoTransactionStored.data().transactionExternalId,
                value: repoTransactionStored.data().value 
            }
        )
        this.clientKafka.emit('check-transaction', msg);
        return TransactionPostDto.domainToGetResponse(repoTransactionStored);
    }
}
