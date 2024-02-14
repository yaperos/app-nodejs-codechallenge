import { Injectable } from '@nestjs/common';
import { TransferRequest } from 'src/antifraud/dtos/transfer-request';
import { KafkaService } from '../services-core/kafka.service';

@Injectable()
export class AntifraudService {
  constructor(private readonly kafkaService: KafkaService) {
    this.startConsuming();
  }
  async startConsuming() {
    try {
      this.kafkaService.subscribe(process.env.ANTIFRAUD_TOPIC_REQ, (message: string) => {
        console.log('subscribe - ',process.env.ANTIFRAUD_TOPIC_REQ,' - ',message);
        this.evaluarTransaccion(JSON.parse(message));
      });
    } catch (error) {
      console.error('Error suscribirse Kafka:', error);
    }
  }

  async handleMessage(message: any) {
    console.log('--> Message :', message);
  }

  evaluarTransaccion(transaccion: TransferRequest): void {
    transaccion.status = (transaccion.value > 1000) ? 'rejected' : 'approved';
    console.log('publish - ',process.env.ANTIFRAUD_TOPIC_PULL,' - ',transaccion);
    this.kafkaService.publish(process.env.ANTIFRAUD_TOPIC_PULL, transaccion);
  }
}