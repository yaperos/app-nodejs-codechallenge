import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionService {

    constructor(
        @Inject('ANTI_FRAUD_MS') private readonly clientKafka: ClientKafka
    ){}

    create(data: any){
        Logger.log('enviado transaccion')
        this.clientKafka.emit('transaction.created',{id:1,transaction:'transaction created'})
        return {status: 'ok', data: true}
    }
}
