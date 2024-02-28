import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { LoggerService } from "../logger/logger.service";
import { AntifraudService } from "../services/antifraud.service";

@Controller()
export class AntifraudController {
    constructor(
        private readonly loggerService: LoggerService,
        private readonly antifraudService: AntifraudService
    ){}

    @MessagePattern('created.event')
    public async createdTransactionEvent(@Payload() payload: any){
        this.loggerService.log(JSON.stringify(payload),AntifraudController.name)
        
        const {createdTransaction} = payload;
        await this.antifraudService.checkTransaction(createdTransaction);
    }
}