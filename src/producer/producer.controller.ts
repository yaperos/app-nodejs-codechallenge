import { BadRequestException, Body, Controller, Get, Param, Post,  } from "@nestjs/common";
import { ProducerService } from "./producer.service";
import { Transaccion } from "@prisma/client";

@Controller('producer')
export class ProducerController {
    constructor(private readonly producerService: ProducerService) {}

    @Post()
    async home(){
        return {status: 'ok'};
    }

    @Post('save_send')
    async saveTransaction(@Body() transaction: Transaccion) {
        try {
            const datos_enviar = {
                ...transaction,
                "transactionExternalId": 'id_' + Math.random().toString(36).substr(2, 9),
                "status": 1,
                "created_at": new Date(),
            }
            const data = await this.producerService.saveTransaction(datos_enviar);
            await this.producerService.sendTransaction(data);
            return data;
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error);
        }
    }

    async sendTransaction(transaccion: Transaccion) {
        await this.producerService.sendTransaction(transaccion);
    }

}

