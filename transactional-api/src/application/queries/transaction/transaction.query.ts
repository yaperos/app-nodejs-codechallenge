import { Inject, Injectable } from '@nestjs/common';
import { GetTransactionRequestDto } from 'src/application/adapters/transaction/get-transaction.request.dto';
import { TransactionStatus } from 'src/domain/constants/transactionstatus.enum';
import { TransactionType } from 'src/domain/constants/transactiontype.enum';
import { ITransactionRepository } from 'src/domain/interfaces/itransaction.repository';
import { TransactionRepository } from 'src/infrastructure/repositories/transaction/transaction.repository';

@Injectable()
export class TransactionQuery {

    constructor(
        @Inject(TransactionRepository) 
        private readonly transactionRepository: ITransactionRepository,
      ) {}

    async getTransaction(params: GetTransactionRequestDto){
        var data = await this.transactionRepository.searchByAsync(params.transactionExternalId);
        return {
            transactionExternalId: data.transactionExternalId,
            transactionType: {
                name: TransactionType[data.transactionType]
            },
            transactionStatus:{
                name: TransactionStatus[data.transactionStatus]
            },
            value: data.value,
            createdAt: data.createDateTime
        };
    }
}
