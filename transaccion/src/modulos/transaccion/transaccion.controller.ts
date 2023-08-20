import { Body, Controller, Post } from "@nestjs/common";
import { CrearTransaccionRequestDto } from "./data/request";
import { CommandBus } from "@nestjs/cqrs";

@Controller("transaccion")
export class TransaccionController{

    constructor(
        private readonly commandBus: CommandBus,
    ){}
    @Post()
    async crearTransaccion(@Body() requestBody:CrearTransaccionRequestDto){
        return this.commandBus.execute(CrearTransaccionRequestDto.toCommand(CrearTransaccionRequestDto.limpiar(requestBody)))
    }
}