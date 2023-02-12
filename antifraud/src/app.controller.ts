import {Controller} from "@nestjs/common";
import {AppService} from "./app.service";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CreateTransactionDto} from "./dtos";

@Controller()
export class AppController {
    constructor(private readonly _appService: AppService) {}

    @MessagePattern('transaction')
    validateTransaction(@Payload() transaction: CreateTransactionDto) {
        return this._appService.validateTransaction(transaction);
    }
}