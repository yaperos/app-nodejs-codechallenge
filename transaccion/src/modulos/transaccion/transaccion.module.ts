import { Module } from "@nestjs/common";
import { TransaccionController } from "./transaccion.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { CrearTransaccionCommandHandler } from "./command/crear-transaccion.command";
import { PrismaModule } from "../../app/baseDatos/prisma.module";
const commands=[CrearTransaccionCommandHandler]
 @Module({
    imports:[CqrsModule,PrismaModule],
    controllers:[TransaccionController],
    providers:[...commands]
 })
 export class TransaccionModule{}