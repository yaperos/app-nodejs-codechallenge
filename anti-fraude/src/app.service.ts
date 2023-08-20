import { Inject, Injectable } from '@nestjs/common';
import { VerificarTransaccionRequestDto } from './data/request';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionEstado } from './data/const';

@Injectable()
export class AppService {

  constructor(
    @Inject('ANTI_FRAUD_EMITTER') private readonly kafkaClient: ClientKafka,
  ){}

  verificarTransaccion(transaction: VerificarTransaccionRequestDto) {
    console.log(transaction, 'transaction');
    
    const { id, value } = transaction;
    
    const estado =
      value > 1000 ? TransactionEstado.RECHAZADO : TransactionEstado.APROVADO;
    const kafkaRequest=JSON.stringify({ id:id, estado: estado.toString() })
    console.log("kafkaRequest:::",kafkaRequest)
    return this.kafkaClient.emit(
      'update-transaction',
      kafkaRequest
    );
  }
}
