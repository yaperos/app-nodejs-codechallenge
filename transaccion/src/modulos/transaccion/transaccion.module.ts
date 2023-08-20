import { Module } from "@nestjs/common";
import { TransaccionController } from "./transaccion.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { CrearTransaccionCommandHandler } from "./command/crear-transaccion.command";
import { PrismaModule } from "../../app/baseDatos/prisma.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
const commands=[CrearTransaccionCommandHandler]
 @Module({
    imports:[CqrsModule,PrismaModule, ClientsModule.register([
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
    ]),],
    controllers:[TransaccionController],
    providers:[...commands]
 })
 export class TransaccionModule{}