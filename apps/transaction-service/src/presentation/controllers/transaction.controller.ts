import { type TransactionType, TransactionTypeNames } from '@app/common';
import { LoggerService } from '@app/observability';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
    CREATE_TRANSACTION_USE_CASE,
    type ICreateTransactionUseCase,
} from '../../domain/ports/input/create-transaction.use-case.interface';
import {
    GET_TRANSACTION_USE_CASE,
    type IGetTransactionUseCase,
} from '../../domain/ports/input/get-transaction.use-case.interface';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import type { TransactionResponseDto } from '../dtos/transaction-response.dto';

@Controller('transactions')
export class TransactionController {
    constructor(
        @Inject(CREATE_TRANSACTION_USE_CASE)
        private readonly createTransactionUseCase: ICreateTransactionUseCase,
        @Inject(GET_TRANSACTION_USE_CASE)
        private readonly getTransactionUseCase: IGetTransactionUseCase,
        private readonly logger: LoggerService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createTransaction(@Body() dto: CreateTransactionDto, @Req() req: Request): Promise<TransactionResponseDto> {
        const context = {
            correlationId: (req as any).correlationId,
            requestId: (req as any).requestId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };

        this.logger.log('Creating transaction', context, {
            accountDebit: dto.accountExternalIdDebit,
            accountCredit: dto.accountExternalIdCredit,
            value: dto.value,
        });

        const transaction = await this.createTransactionUseCase.execute(dto, context);

        this.logger.log('Transaction created successfully', context, {
            transactionId: transaction.transactionExternalId,
        });

        return this.mapToResponse(transaction);
    }

    @Get(':transactionExternalId')
    async getTransaction(
        @Param('transactionExternalId') transactionExternalId: string,
        @Req() req: Request,
    ): Promise<TransactionResponseDto> {
        const context = {
            correlationId: (req as any).correlationId,
            requestId: (req as any).requestId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };

        this.logger.log('Fetching transaction', context, {
            transactionId: transactionExternalId,
        });

        const transaction = await this.getTransactionUseCase.execute(transactionExternalId);

        return this.mapToResponse(transaction);
    }

    private mapToResponse(transaction: any): TransactionResponseDto {
        return {
            transactionExternalId: transaction.transactionExternalId,
            transactionType: {
                name: TransactionTypeNames[transaction.transferTypeId as TransactionType] || 'Unknown',
            },
            transactionStatus: {
                name: transaction.transactionStatus,
            },
            value: transaction.value,
            createdAt: transaction.createdAt,
        };
    }
}
