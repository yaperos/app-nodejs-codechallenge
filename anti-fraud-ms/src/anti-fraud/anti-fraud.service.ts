import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {

    constructor( 
        @Inject('TRANSACTION_API_MS') private readonly clientKafka: ClientKafka
    ){}

    transactionValidate(data: any){

        const transactionResponse = {
            id: data.id,
            transactionStatus: {
                name: "PENDING"
            },
            value: data.value,
            createdAt: new Date()
        }

        if(data.value >= 1000){
            transactionResponse.transactionStatus.name = 'REJECTED'
            this.clientKafka.emit('transaction-updated',JSON.stringify(transactionResponse))
        }else{
            transactionResponse.transactionStatus.name = 'APPROVED'
            this.clientKafka.emit('transaction-updated',JSON.stringify(transactionResponse))
        }
    }
}
