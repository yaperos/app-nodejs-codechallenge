import { Body, Controller, Post, Version } from "@nestjs/common";
import { TransactionApplication } from "../../application/transaction.application";
import { TransactionCreateDto } from "./dtos/transaction-create.dto";
import { v4 as uuidv4 } from "uuid"
import { TStatusTransaction, Transaction, TransactionProps } from "../../domain/transaction";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiGatewayTimeoutResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransactionCreatedResponse } from "../../application/dtos/transaction-created.dto";
import { GenericError, ResponseDescription } from "../../../core/presentation/errors/generic-error";
import {
    ClientKafka,
    Ctx,
    KafkaContext,
    MessagePattern,
    EventPattern,
    Payload,
    Client,
    Transport
} from '@nestjs/microservices';
import { TransactionUpdatedResponse } from "../../application/dtos/transaction-updated.dto";
import { TransactionUpdateDto } from "./dtos/transaction-update.dto";
import { Inject } from "@nestjs/common";

@ApiTags("Transaction")
@Controller("transaction")
export class TransactionController {

    constructor(private readonly application: TransactionApplication) { }

    @Post()
    @Version('1')
    @ApiOperation({ summary: 'Create a transaction' })
    @ApiCreatedResponse({
        description: 'The transaction has been successfully created.',
        type: TransactionCreatedResponse,
    })
    @ApiBadRequestResponse({
        type: GenericError,
        description: ResponseDescription.BAD_REQUEST,
    })
    @ApiInternalServerErrorResponse({
        type: GenericError,
        description: ResponseDescription.INTERNAL_SERVER_ERROR,
    })
    @ApiGatewayTimeoutResponse({
        type: GenericError,
        description: ResponseDescription.API_GATEWAY_TIMEOUT,
    })
    async create(@Body() transaction: TransactionCreateDto) {
        const { accountExternalIdCredit, accountExternalIdDebit, transferTypeId, value } = transaction
        const transactionId = uuidv4()

        const props: TransactionProps = { ...transaction, transactionId }
        const instanceTransaction = new Transaction(props)

        return await this.application.save(instanceTransaction)
    }

    @Post("/update")
    @Version('1')
    @ApiOperation({ summary: 'Update status transaction' })
    @ApiCreatedResponse({
        description: 'The transaction has been successfully updated.',
        type: TransactionUpdatedResponse,
    })
    @ApiBadRequestResponse({
        type: GenericError,
        description: ResponseDescription.BAD_REQUEST,
    })
    @ApiInternalServerErrorResponse({
        type: GenericError,
        description: ResponseDescription.INTERNAL_SERVER_ERROR,
    })
    @ApiGatewayTimeoutResponse({
        type: GenericError,
        description: ResponseDescription.API_GATEWAY_TIMEOUT,
    })
    async update(@Body() transactionStatus: TransactionUpdateDto) {
        const { transactionId, status } = transactionStatus
        await this.application.update(transactionId, status as TStatusTransaction)
        return { transactionId, status }
    }

}