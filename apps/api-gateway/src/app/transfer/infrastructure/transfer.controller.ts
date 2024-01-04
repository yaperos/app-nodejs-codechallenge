import { BadRequestException, Body, Controller, Get, Logger, Param, Post, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { TransactionDto } from "@yape-transactions/shared";
import { TransactionService } from "../application/transaction.service";
import { TransferCommand } from "../domain/transfer.commnad";
import { UUID } from "crypto";
import { FindTransactionCommand } from "../domain/find-transaction.command";
import { isUUID } from "class-validator";
import { CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";

const GET_TX_BY_ID_TTL = Number(process.env.GET_TX_BY_ID_TTL ?? '10000');

@Controller()
export class TransferController {
    private logger = new Logger(TransferController.name);
    constructor(private transferService: TransactionService) {

    }

    @Post('v1/transaction')
    createTransaction(@Body(ValidationPipe) trnsferDto: TransactionDto) {
        const command = new TransferCommand(trnsferDto);
        return this.transferService.createTransaction(command);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheKey('get_transaction_by_id')
    @CacheTTL(GET_TX_BY_ID_TTL)
    @Get('v1/transaction/:transactionId')
    findTransaction(@Param("transactionId") transactionId: UUID) {
        this.logger.debug(`Ejecutando servicio con parametro ${transactionId}`);
        // se podria llevar a un pipe validation personzlaido
        if (!isUUID(transactionId)) {
            throw new BadRequestException({
                message: "Formato de parametro incorrecto"
            });
        }
        const command = new FindTransactionCommand(transactionId);
        return this.transferService.findTransaction(command);
    }
}