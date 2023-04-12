import {Controller, Get, Post, Body, Param, Inject} from '@nestjs/common';
import {TransactionService} from './transaction.service';
import {CreateTransactionDto} from './dto/create-transaction.dto';
import {KafkaMessage, Producer} from "kafkajs";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {TransactionStatus} from "./entities/transaction.entity";

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService,
                @Inject('KAFKA_PRODUCER') private kafkaProducer: Producer) {
    }

    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return await this.transactionService.create(createTransactionDto);
    }

    @Get('typeTransactions')
    findTypeTransactions() {
        return this.transactionService.findTypeTransactions();
    }

    @Get('typeStatus')
    findTypeStatus() {
        return this.transactionService.findTypeStatus();
    }

    @Get()
    findAll() {
        return this.transactionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionService.findOne(+id);
    }

    @MessagePattern('transactions-approved')
    async consumerApproved(@Payload() message: KafkaMessage) {
        const {id} = message as any;
        const consumerAprroved = await this.transactionService.update(id, {statusId: TransactionStatus.Approved});
        console.log('CONSUMER APPROVED => ', consumerAprroved);
        return consumerAprroved;
    }

    @MessagePattern('transactions-rejected')
    async consumerRejected(@Payload() message: KafkaMessage) {
        const {id} = message as any;
        const consumerRejected = await this.transactionService.update(id, {statusId: TransactionStatus.Rejected});
        console.log('CONSUMER REJECTED => ', consumerRejected);
        return consumerRejected;
    }
}
