import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

const controllers = [AppController];

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    // Configuración del cliente Kafka
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_EMITTER', // Nombre del cliente
        transport: Transport.KAFKA, // Tipo de transporte Kafka
        options: {
          client: {
            brokers: ['localhost:9092'], // Lista de brokers de Kafka
          },
          consumer: {
            groupId: 'anti-fraud-microservice-consumer', // Grupo de consumidores
          },
        },
      },
    ]),
  ],
  controllers: [...controllers],
  providers: [AppService], // Proveedor del servicio
})
export class AppModule {}