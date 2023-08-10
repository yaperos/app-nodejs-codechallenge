import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Crea una instancia de la aplicación NestJS
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // Configura el transporte como Kafka
      transport: Transport.KAFKA,
      options: {
        // Configuración del cliente Kafka
        client: {
          brokers: ['localhost:9092'], // Lista de brokers de Kafka
        },
        // Configuración del consumidor Kafka
        consumer: {
          groupId: 'anti-fraud-microservice-consumer', // ID del grupo de consumidores
        },
      },
    },
  );
  // Inicia el microservicio
  await app.listen();
}

// Llama a la función bootstrap para iniciar la aplicación
bootstrap();
