import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Observable, from, map } from "rxjs";
import { TransactionEntity, TransactionResult } from "@yape-transactions/shared";
import { GetTransactionPort } from "../domain/get-transaction.port";
import { GetTransactionCommand } from "../domain/get-transaction.command";

@Injectable()
export class GetTransactionDbAdapter implements GetTransactionPort {
    private logger = new Logger(GetTransactionDbAdapter.name);

    constructor(@InjectRepository(TransactionEntity) private readonly txRepository: Repository<TransactionEntity>) {

    }
    findTransactionById(command: GetTransactionCommand): Observable<TransactionResult | null> {
        return from(this.txRepository.findOneBy({
            transactionId: command.transactionId
        })).pipe(
            map(result => {
                this.logger.debug(`resultado DB ${JSON.stringify(result)}`);
                if (!result) {
                    return null;
                }

                return {
                    createdAt: result.createDateTime,
                    transactionExternalId: result.transactionId,
                    transactionStatus: {
                        name: result.status
                    },
                    transactionType: {
                        name: '' + result.tranferTypeId
                    },
                    value: result.value
                } as TransactionResult;
            })
        );
    }


}