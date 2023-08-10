import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { TransactionController } from './interfaces/http/transaction.controller';
import { CreateTransactionCommandHandler } from './application/commands/create-transaction.command';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionInfrastructure } from './infrastructure/transaction.infrastructure';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UpdateTransactionCommandHandler } from './application/commands/update-transaction.command';
import { GetTransactionQueryHandler } from './application/queries/get-transaction.query';

// Define los controladores que pertenecen al módulo
const controllers = [TransactionController];

// Define los componentes del dominio (si aplicable)
const domain = [];

// Define los manejadores de comandos de la aplicación
const application = [
  CreateTransactionCommandHandler,
  UpdateTransactionCommandHandler,
  GetTransactionQueryHandler,
];

// Define los componentes de la infraestructura
const infrastructure = [TransactionInfrastructure];

@Module({
  imports: [
    // Importa el módulo CQRS para manejar comandos y consultas
    CqrsModule,
    // Configura el módulo de configuración con el esquema de validación
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    // Configura el módulo de clientes microservicios para Kafka
    ClientsModule.register([
      {
        name: 'TRANSACTION_EMITTER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [...controllers], // Agrega los controladores al módulo
  providers: [AppService, ...domain, ...application, ...infrastructure], // Agrega los proveedores al módulo
})
export class AppModule {}
