import { Body, Controller, HttpStatus, Inject, OnModuleInit, Post } from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create.transaction.dto";
//import { UsecaseProxyModule } from "src/transaction/infraestructures/usecaseproxy/use.case.proxy.module";
//import { UseCaseProxy } from "src/transaction/infraestructures/usecaseproxy/use.case.proxy";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {  ApiBadRequestResponse,  ApiInternalServerErrorResponse,  ApiNotFoundResponse,  ApiResponse,  ApiTags,  ApiUnauthorizedResponse,  ApiUnprocessableEntityResponse} from '@nestjs/swagger';

import { Auth, AuthorizedHeader } from 'libs/Auth';
import { ResponseDescription } from "../ResponseDescription";
import { CreateTransactionCommand } from "src/transaction/applications/commands/create.transaction.command";
import { promises } from "dns";
import { TransactionEntity } from "src/transaction/infraestructures/entities/transaction.entity";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";


@ApiTags('Transaction')
@Controller()
export class TransactionController implements OnModuleInit {
    
    constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {
    
    }
    async onModuleInit() {
     
    }

    @ApiResponse({
      status: HttpStatus.CREATED,
      description: ResponseDescription.CREATED,
    })    
    @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
    @ApiInternalServerErrorResponse({
      description: ResponseDescription.INTERNAL_SERVER_ERROR,
    })    
    @Post("transaction")
    async createTransaction(@Body() body: CreateTransactionDto): Promise<TransactionEntity> {        
      const command = new CreateTransactionCommand(body.accountExternalIdCredit,body.accountExternalIdDebit,body.tranferTypeId,body.value);
      return await this.commandBus.execute(command);
    }
}
