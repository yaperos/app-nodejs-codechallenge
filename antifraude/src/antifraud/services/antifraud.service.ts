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
      this.kafkaService.subscribe(
        process.env.TOPIC_REQ_ANTIFRAUD,
        (message: string) => {
          this.evaluarTransaccion(JSON.parse(message));
        },
      );
    } catch (error) {
      console.error('Error al suscribirse a Kafka:', error);
    }
  }

  async handleMessage(message: any) {
    console.log('Nuevo mensaje recibido:', message);
  }

  evaluarTransaccion(transaccion: TransferRequest): void {
    transaccion.status = 1000 >= transaccion.amount ? 'approved' : 'rejected';
    this.kafkaService.publish(process.env.TOPIC_PULL_ANTIFRAUD, transaccion);
  }
}
