import { Body, Controller, ParseIntPipe, Post, Get,  Param, Logger, Put} from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";
import { TransactionService } from '../../app/transaction.service';
import { ApiTags, ApiResponse,ApiBody, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { TransactionCreateDto } from '../../app/dto/transaction.dto';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController{

    constructor(
        private readonly transactionService: TransactionService,
    ){
    }

    @Post('/create')
    @ApiBody({
        type: TransactionCreateDto,
    })
    @ApiOperation({
        summary: 'Registra la transaccion'
    })
    @ApiResponse({
        status:200,
        description: 'Registra la transaccion en la base de datos'
    })
    @ApiResponse({
        status:400,
        description: "Algunos de los parametros enviados son incorrectos"
    })
    @ApiResponse({ status: 500, description: 'Error en el servidor' })
    
    async create(@Body() body: TransactionCreateDto){
        const resp = await this.transactionService.create(body)

        await this.transactionService.sendTransaction(resp);

        return resp;
    }

    @MessagePattern('transactions.reply')
    async transactionValidate(@Payload() data:any){

        const {id,status} = data;

        return await this.transactionService.updateTransaction(parseInt(id), status);

    }

    @Get('/:id')
    @ApiQuery({
        name: 'id',
        description: 'identificador unico de transaccion',
        example: 1,
        type: 'number'
    })
    @ApiOperation({ summary: 'Busca la transaccion por su id unico' })
    @ApiResponse({ status: 200, description: 'Entrega la informacion de la transaccion' })
    @ApiResponse({
        status: 400,
        description: 'Alguno de los parametros enviados en el body son incorrectos',
    })
    @ApiResponse({ status: 500, description: 'Error en el servidor' })
    findByTransactionalExternalId(@Param('id',ParseIntPipe) id:number ){
        return this.transactionService.findByTransactionalExternalId(id)
    }


}