import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from '../service/transaction.service';
import { TransactionEntity } from '../entity/transaction.entity';
import { RequestTransaction } from '../dto/request-transaction.args';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Resolver()
export class TransactionResolver {

    constructor(
        private transactionS: TransactionService,
        @Inject('TRANSACTION_SERVICE')
        private readonly kafka: ClientProxy
    ) { }

    @Query(() => [TransactionEntity])
    transaction() {
        return this.transactionS.findAll();
    }

    @Query(() => TransactionEntity)
    transactionById(
        @Args('transactionExternalId')
        transactionExternalId: string
    ) {
        return this.transactionS.findById(transactionExternalId);
    }

    @Mutation(() => TransactionEntity)
    async saveTransaction(
        @Args('ReqTransaction')
        reqTransaction: RequestTransaction
    ) {
        const resp = await this.transactionS.save(reqTransaction);

        if (resp) this.kafka.emit('transaction_created', { message: resp });

        return resp;
    }
}
