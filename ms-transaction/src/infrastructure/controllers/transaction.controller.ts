import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import TransactionCommand from '../../application/commands/transaction.command';
import { TransactionVerifiedDto } from '../../application/dtos/transactionVerified.dto';
import { UpdateTransactionDTO } from '../../application/dtos/updateTransaction.dto';
import CreateTransactionUseCase from '../../application/usecases/createTransaction.usecase';
import DeleteTransactionUseCase from '../../application/usecases/deleteTransaction.usecase';
import GetAllTransactionsUseCase from '../../application/usecases/getAllTransactions.usecase';
import GetTransactionUseCase from '../../application/usecases/getTransaction.usecase';
import TransactionVerifiedUseCase from '../../application/usecases/transactionVerified.usecase';
import UpdateTransactionUseCase from '../../application/usecases/updateTransaction.usecase';
import { GetTransactionDto } from '../../application/dtos/getTransaction.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import Transaction from '../../domain/transaction';

@ApiTags('Transaccion')
@Controller('transactions')
export class TransactionController {
  constructor(
    private getAllTransactionsUseCase: GetAllTransactionsUseCase,
    private getTransactionUseCase: GetTransactionUseCase,
    private createTransactionUseCase: CreateTransactionUseCase,
    private updateTransactionUseCase: UpdateTransactionUseCase,
    private deleteTransactionUseCase: DeleteTransactionUseCase,
    private transactionVerified: TransactionVerifiedUseCase,
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly brokerClient: ClientKafka,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiResponse({ status: 200, type: Transaction, isArray: true })
  async getTransactions(): Promise<any> {
    return await this.getAllTransactionsUseCase.handler();
  }

  @Get(':transactionId')
  @ApiOperation({ summary: 'Obtener una transaccion por id' })
  @ApiParam({ name: 'transactionId', format: 'uuid' })
  @ApiResponse({ status: 200, type: GetTransactionDto })
  async getTransaction(
    @Param('transactionId') transactionId: string,
  ): Promise<any> {
    return await this.getTransactionUseCase.handler(transactionId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una transaccion' })
  @ApiBody({ type: TransactionCommand })
  @ApiResponse({ status: 200, type: Transaction })
  async createTransaction(
    @Body() createTransactionDTO: TransactionCommand,
  ): Promise<any> {
    const transaction = await this.createTransactionUseCase.handler(
      createTransactionDTO,
    );
    this.brokerClient.emit(
      'transaction-validate',
      JSON.stringify({
        transactionExternalId: transaction.get().getTransactionId(),
        value: transaction.get().getValue(),
      }),
    );
    return transaction;
  }

  @Put(':transactionId')
  @ApiOperation({ summary: 'Actualizar una transaccion' })
  @ApiParam({ name: 'transactionId', format: 'uuid' })
  @ApiResponse({ status: 200, type: Transaction })
  async updateTransaction(
    @Param('transactionId') transactionId: string,
    @Body() newTransaction: UpdateTransactionDTO,
  ): Promise<any> {
    return await this.updateTransactionUseCase.handler(
      transactionId,
      newTransaction,
    );
  }

  @Delete(':transactionId')
  @ApiOperation({ summary: 'Eliminar una transaccion' })
  @ApiParam({ name: 'transactionId', format: 'uuid' })
  @ApiResponse({ status: 200, type: Transaction })
  async deleteTransaction(
    @Param('transactionId') transactionId: string,
  ): Promise<any> {
    return await this.deleteTransactionUseCase.handler(transactionId);
  }

  @MessagePattern('transaction-verified')
  handleTransactionVerified(@Payload() data: TransactionVerifiedDto) {
    return this.transactionVerified.handler(data);
  }
}
