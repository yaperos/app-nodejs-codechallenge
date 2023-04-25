import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {

    constructor( 
        @Inject('TRANSACTION_API_MS') private readonly clientKafka: ClientKafka
    ){}

    updateTransaction(data: any){
        this.clientKafka.emit('transaction.updated',JSON.stringify({...data,value:90}))
    }
}
