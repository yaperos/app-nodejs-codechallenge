import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_CLIENT',
                useFactory: () => ({
                  transport: Transport.KAFKA,
                  options: {
                    client: {
                      brokers: [process.env.BROKER],
                      retry: {
                        retries: 5, // Número máximo de reintentos
                        multiplier: 2, // Factor multiplicador para los tiempos de espera entre reintentos
                        initialRetryTime: 1000, // Tiempo de espera mínimo entre reintentos (en milisegundos)
                        maxRetryTime: 3000, // Tiempo de espera máximo entre reintentos (en milisegundos)
                        factor: 0.2, // Agregar aleatZoriedad a los tiempos de espera
                      }
                    },
                    consumer: {
                      groupId: process.env.TRANSACTION_GROUP_ID,
                    }
                  }
                }),
              }
        ]),
    ],
    providers: [TransactionResolver, TransactionService],
    controllers: [TransactionController],
})
export class TransactionModule {}
