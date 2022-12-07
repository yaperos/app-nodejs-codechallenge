import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import _ from 'lodash';
import { TransactionEntity } from 'src/transaction/model/entity/transaction-entity';


@Injectable()
export class KnexDatabaseService {
    constructor(@InjectConnection() private readonly knex: Knex) {}

    async saveTransaction(transactionEntity: TransactionEntity) {
        return await this.knex('transaction').insert(transactionEntity).returning('*');
    }

    async updateTransaction(status: number, id: number) {
        return await this.knex('transaction')
        .update({ status })
        .where({ id });
    }

    async findTransactionsByProduct(productType: string, productId: string) {
        return await this.knex('transaction')
        .select('*')
        .where({
            [productType]: productId
        });
    }
}
