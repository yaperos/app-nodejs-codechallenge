import { BadRequestException, Body, Controller, Get, Param, Post,  } from "@nestjs/common";
import { Transaccion } from "@prisma/client";
import { ConsumerService } from "./consumer.service";

@Controller('consumer')
export class ConsumerController {
    constructor(private consumerService: ConsumerService) {}

    @Get()
    async consume() {
        const mensaje  = await this.consumerService.consume();
        console.log("mensaje desde controlador")
        console.log(mensaje)
        return mensaje;
    }
    @Post('transaccion')
    async getTransaccion(@Body() transaction: any): Promise<Transaccion> {
        try {
            const data = await this.consumerService.getTransaccion(transaction.transactionExternalId);
            const data_formart: any = {
                transactionExternalId: data.transactionExternalId,
                transactionType: {
                    name: data.tranferTypeId === 1 ? "deposit" : "withdraw"
                },
                transactionStatus: {
                    name: data.status === 2 ? "approved" : "rejected"
                },
                value: data.value,
                createdAt: data.created_at,
           
            }; 
            return data_formart;
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error);
        }
    }
}
