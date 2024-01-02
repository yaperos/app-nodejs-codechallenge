import { TransactionDto, TransactionEntity, TransactionStatusEnum } from "@yape-transactions/shared";
import { CreateTransactionPort } from "../domain/create-transaction.port";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { from, map } from "rxjs";
import { UUID } from "crypto";

//

export class CreateTransactionDBAdapater implements CreateTransactionPort {
    constructor(@InjectRepository(TransactionEntity) private readonly txRepository: Repository<TransactionEntity>) {

    }
    createTransaction(txDto: TransactionDto) {
        const transaction = new TransactionEntity();
        transaction.accountExternalIdCredit = txDto.accountExternalIdCredit;
        transaction.accountExternalIdDebit = txDto.accountExternalIdDebit;
        transaction.status = TransactionStatusEnum.PENDING;
        transaction.tranferTypeId = txDto.tranferTypeId;
        transaction.value = txDto.value;
        return from(this.txRepository.insert(transaction)).pipe(
            map(insertResult => {
                console.log('result', JSON.stringify(insertResult));
                return insertResult.identifiers[0].transactionId as UUID;
            }),
        );
    }


}