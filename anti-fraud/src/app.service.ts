import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionToValidate } from './dto/transactionToValidate.dto';
import { ValidatedTransaction } from './dto/transaction.dto';
import { TOBEAPPROVED } from './constant/status';
import { ClientKafka } from '@nestjs/microservices';


@Injectable()
export class AppService {
    private logger: Logger;
    constructor(
        @Inject(`TRANSACTIONS-SERVICE`) private readonly transactionsClient: ClientKafka,
    ){
        this.logger = new Logger(AppService.name);
    }

    /**
     * Function Validate: This function simulates a validation
     * made by a third party service
     * @param data
     */
    public async validate(data: TransactionToValidate): Promise<ValidatedTransaction> {
        if(data.values <= TOBEAPPROVED){
            const response: ValidatedTransaction = {
                id: data.id,
                modified_At: Date(),
                transactionExternalId: data.transaction_external_id,
                transactionType: `1`,
                transactionStatus: "Approved",
                values: data.values
            }  
            return response;
        }  else {
            const response: ValidatedTransaction = {
                id: data.id,
                modified_At: Date(),
                transactionExternalId: data.transaction_external_id,
                transactionType: `1`,
                transactionStatus: "Rejected",
                values: data.values
            }  
            return response;

        }
    }

    public emitEventToKafkaTopic(topic: string, data: any){
        this.transactionsClient.emit(topic, data)
    }


}
