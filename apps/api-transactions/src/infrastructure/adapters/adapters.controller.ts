import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';
import { CreateTransaction, Transaction } from '../../core/domain/model/transaction.model';
import { CreateTracingOptions } from 'trace_events';
import { AdaptersService } from './adapters.service';

@Controller('adapters')
export class AdaptersController {
}
