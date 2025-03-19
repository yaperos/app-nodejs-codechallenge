import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBConfigModule } from './infrastructure/config/dynamodb.config';
import { KafkaModule } from './infrastructure/kafka/kafka.module';

// Casos de uso (aplicación)
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.usecase';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.usecase';

// Adaptadores (infraestructura)
import { TransactionDynamoDBAdapter } from './infrastructure/adapters/transaction-dynamodb.adapter';

// Controladores HTTP y/o microservicio
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { TransactionMessageController } from './infrastructure/controllers/transaction-message.controller';

@Module({
  imports: [
    // Carga variables de entorno desde .env (opcional)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configuración de DynamoDB (región, credenciales, etc.)
    DynamoDBConfigModule,
    // Configuración de Kafka (productor, etc.)
    KafkaModule,
  ],
  // Controladores que atienden peticiones HTTP (TransactionController)
  // y/o mensajes Kafka (TransactionMessageController).
  controllers: [
    TransactionController,
    TransactionMessageController,
  ],
  // Proveedores disponibles en el módulo:
  // - Casos de uso
  // - Repositorio de transacciones (adaptador DynamoDB)
  providers: [
    CreateTransactionUseCase,
    GetTransactionUseCase,
    {
      provide: 'TransactionRepository',
      useClass: TransactionDynamoDBAdapter,
    },
  ],
})
export class AppModule {}
