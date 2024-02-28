import { Inject, Injectable } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";
import { ClientProxy } from "@nestjs/microservices";
import { BankingTransaction } from "src/domain/models/banking-transaction";
import { UpdateBankingTransaction } from "src/domain/models/update-banking-transaction";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AntifraudService {

    constructor(
        private readonly logger: LoggerService,
        @Inject('KAFKA')
        private readonly kafka: ClientProxy
    ) { }

    async checkTransaction(payload: any): Promise<any> {
        try {
            const transaction = payload as BankingTransaction;
            console.log(transaction)
            if( payload.value > 1000){
                this.logger.log('greater than 1000', 'rejected, sending to update')

                const updateTransaction: UpdateBankingTransaction = {
                    transactionStatus: "rejected",
                    transactionExternalId: transaction.transactionExternalId
                }

                const response = await firstValueFrom(this.kafka.emit('rejected.event', { updateTransaction }));
                console.log(response)
            }
            else if (payload.value < 1000){
                this.logger.log('less than 1000', 'approbed, sending to update')

                const updateTransaction: UpdateBankingTransaction = {
                    transactionStatus: "approbed",
                    transactionExternalId: transaction.transactionExternalId
                }

                this.kafka.emit('approbed.event', { updateTransaction });
            }

        } catch (error) {
            this.logger.log('Somethin wrong', 'error, check exception')
        }
    }


}