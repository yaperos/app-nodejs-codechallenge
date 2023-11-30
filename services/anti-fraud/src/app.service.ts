import { Injectable } from '@nestjs/common';
import { consumer, producer } from './config/kafka.config';

class IValidatedTransaction {
  id: string;
  transactionStatusId: number;
}

@Injectable()
export class AppService {

  async initValidation(): Promise<void> {
    await consumer.connect();
    await consumer.subscribe({ topic: 'validating-transaction' });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const transaccionData = JSON.parse(message.value.toString());
        console.log("se recibe topico desde servicio transaction para validar monto", transaccionData);
        const validation = await this.validateTransaction(transaccionData);
        console.log(validation);

      },
    });
  }

  private async validateTransaction({ transactionValue, id }): Promise<string> {
    const transaction: IValidatedTransaction = {
      id,
      transactionStatusId: transactionValue < 1000 ? 2 : 3
    };
    try {
      await this.sendToKafka(transaction);
      return `Se envia a kafka notificacion de validacion de transaccion: ${transaction}`;
    } catch (error) {
      throw new Error('Error en la validación de la transacción');
    }
  }

  private async sendToKafka(message: IValidatedTransaction): Promise<void> {
    try {
      await producer.connect(); // Conecta con el broker de Kafka
      // Enviar evento a Kafka para notificar la valiacion de la transacción
      await producer.send({
        topic: 'validated-transaction',
        messages: [{ value: JSON.stringify(message) }],
      });
      await producer.disconnect(); // Desconecta el productor después de enviar el mensaje
    } catch (error) {
      throw new Error('Error enviando mensaje a Kafka');
    }
  }
}
