import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { LoggerService } from "../logger/logger.service";
import { BankingTransactionService } from "../services/banking-transaction.service";


@Controller()
export class BankingTransactionController {
    constructor(
        private readonly loggerService: LoggerService,
        private readonly bankingTransactionService: BankingTransactionService
    ){}

    @MessagePattern('approbed.event')
    public async approbedTransactionEvent(@Payload() payload: any){
        this.loggerService.log('received to update', BankingTransactionController.name)
        
        this.loggerService.log(JSON.stringify(payload),BankingTransactionController.name)
        const {updateTransaction} = payload;
        return await this.bankingTransactionService.updateTransaction(updateTransaction);
    }

    @MessagePattern('rejected.event')
    public async rejectedTransactionEvent(@Payload() payload: any){
        this.loggerService.log('received to update', BankingTransactionController.name)
        this.loggerService.log(JSON.stringify(payload),BankingTransactionController.name)
        const {updateTransaction} = payload;
        return await this.bankingTransactionService.updateTransaction(updateTransaction);
    }
}