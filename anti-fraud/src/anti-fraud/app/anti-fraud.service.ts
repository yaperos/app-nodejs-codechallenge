// anti-fraud.service.ts
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(@Inject('TRANSACTION_SERVICE') private readonly clientKafka: ClientKafka) {
  }

  async onModuleInit() {

    await this.clientKafka.connect();
    this.clientKafka.subscribeToResponseOf('transactions');

}

  

  @MessagePattern('transactions')
  async handleTransactionRequest(@Payload() data: any) {

    // Lógica para procesar la solicitud y generar una respuesta
    
    const response = {
        id: data.id,
        status: 'APPROVED'
    }

    if (data.value>=1000) {
        response.status='REJECTED'
    }

    //Logger.log(`Transaction ID: ${response.id} status: ${response.status}`)
    Logger.log(data);
    return response;
  }
  async sendStatusTransaction(data: any){

    //Envio de mensaje de respuesta
    await this.clientKafka.emit('transactions.reply', JSON.stringify(data)).toPromise();
  }
}
