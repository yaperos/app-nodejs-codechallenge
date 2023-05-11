import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from 'src/application/adapters/transaction/create-transaction.request.dto';
import { TransactionStatus } from 'src/domain/constants/transactionstatus.enum';
import { TransactionType } from 'src/domain/constants/transactiontype.enum';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepository } from 'src/domain/interfaces/itransaction.repository';
import { TransactionRepository } from 'src/infrastructure/repositories/transaction/transaction.repository';

@Injectable()
export class TransactionService {

    constructor(
        @Inject('TRANSACTIONAL_EVENTS_SERVICE') 
        private readonly transactionalES: ClientKafka,
        @Inject(TransactionRepository) 
        private readonly transactionRepository: ITransactionRepository,
      ) {}

    async createTransaction(body: CreateTransactionRequestDto){
        var item = new Transaction();
        item.accountExternalIdCredit = body.accountExternalIdCredit;
        item.accountExternalIdDebit = body.accountExternalIdDebit;
        item.transferTypeId = body.tranferTypeId;
        item.value = body.value;
        item.transactionStatus = TransactionStatus.PENDING;
        item.transactionType = body.accountExternalIdCredit ? TransactionType.CREDIT : TransactionType.DEBIT 
        /* TO-DO auth get user*/ item.createdBy = 'Admin';
        await this.transactionRepository.create(item);

        this.transactionalES
        .send('create-transaction', JSON.stringify(body))
        .subscribe((res) => {
            console.log("Respuesta: ");
            console.log(res);
        });

    }
}
