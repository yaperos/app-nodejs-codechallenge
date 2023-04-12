import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from '@nestjs/microservices/client';
import { ValidationResponseDTO } from "./DTO/ValidationResponseDTO";

@Injectable()
export class ValidationService {
    constructor(
        @Inject('MS_TRANSACTION_SERVICE') private readonly _kafka: ClientKafka
    ) {}

    async validateTransaction(transactionExternalId: string, value: number) {

        Logger.log(`VALIDATING TRANSACTION [ID: ${transactionExternalId}]`);

        const result = {
            transactionExternalId: transactionExternalId,
            valid: value <= 1000 ? true : false,
        } as ValidationResponseDTO;

        if (result.valid) {
            
            this._kafka.emit( 
                'transaction.approved',
                 JSON.stringify(result),
            );
        } else {

            this._kafka.emit(
                'transaction.rejected',
                JSON.stringify(result)
            );
        }
    }
}
