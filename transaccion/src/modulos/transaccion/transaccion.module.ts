import { Module } from "@nestjs/common";
import { TransaccionController } from "./transaccion.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { CrearTransaccionCommandHandler } from "./command/crear-transaccion.command";
const commands=[CrearTransaccionCommandHandler]
 @Module({
    imports:[CqrsModule],
    controllers:[TransaccionController],
    providers:[...commands]
 })
 export class TransaccionModule{}