import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
    Res
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiHeader,
    ApiOkResponse,
    ApiTags
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

import { ProxyService } from '../proxy/proxy.service';
import { sendUpstream } from '../proxy/send-upstream';
import { CreateTransactionDocDto, TransactionDocDto } from './transactions.docs';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly proxy: ProxyService) { }

    @Post()
    @Throttle({ default: { limit: 30, ttl: 60_000 } }) // escrituras: más estricto
    @ApiHeader({ name: 'Idempotency-Key', required: false, description: 'Evita duplicar la transacción en reintentos' })
    @ApiCreatedResponse({ type: TransactionDocDto })
    async create(
        @Body() body: CreateTransactionDocDto,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<void> {
        const upstream = await this.proxy.forward({
            method: 'POST',
            path: '/transactions',
            headers: req.headers,
            clientIp: req.ip,
            body,
        });
        sendUpstream(res, upstream);
    }

    @Get(':transactionExternalId')
    @ApiOkResponse({ type: TransactionDocDto })
    async get(
        @Param('transactionExternalId', new ParseUUIDPipe()) transactionExternalId: string,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<void> {
        const upstream = await this.proxy.forward({
            method: 'GET',
            path: `/transactions/${encodeURIComponent(transactionExternalId)}`,
            headers: req.headers,
            clientIp: req.ip,
        });
        sendUpstream(res, upstream);
    }
}