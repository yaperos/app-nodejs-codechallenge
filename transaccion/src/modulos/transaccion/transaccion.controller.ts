import { Body, Controller, Post } from "@nestjs/common";
import { ActuallizarTransaccionRequestDto, CrearTransaccionRequestDto } from "./data/request";
import { CommandBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ActualizarTransaccionCommand } from "./command/actualizar-transaccion.command";

@Controller("transaccion")
export class TransaccionController{

    constructor(
        private readonly commandBus: CommandBus,
    ){}
    @Post()
    async crearTransaccion(@Body() requestBody:CrearTransaccionRequestDto){
        return this.commandBus.execute(CrearTransaccionRequestDto.toCommand(CrearTransaccionRequestDto.limpiar(requestBody)))
    }

    @MessagePattern('update-transaction')
    async handleEventUpdateTransaction(@Payload() data: ActuallizarTransaccionRequestDto) {
        let { id, estado } = data;
        console.log("update-transaction::data:::",data)
        
        // Crear y ejecutar el comando de actualización de transacción
        const command = new ActualizarTransaccionCommand(id, estado);
        console.log("TransaccionController.handleEventUpdateTransaction.command",command)
        await this.commandBus.execute(command);
    }
}