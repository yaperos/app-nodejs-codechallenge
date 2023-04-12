import {Inject, Injectable} from '@nestjs/common';
import {CreateTransactionDto} from './dto/create-transaction.dto';
import {UpdateTransactionDto} from './dto/update-transaction.dto';
import {PrismaService} from "../prisma/prisma.service";
import {Producer} from "kafkajs";
import {TransactionStatus} from "./entities/transaction.entity";

@Injectable()
export class TransactionService {

    constructor(private readonly prismaService: PrismaService,
                @Inject('KAFKA_PRODUCER') private kafkaProducer: Producer) {
    }

    findTypeTransactions() {
        return this.prismaService.transactionType.findMany({})
    }

    findTypeStatus() {
        return this.prismaService.transactionStatus.findMany({})
    }
    async create(createConsumerDto: CreateTransactionDto) {
        createConsumerDto.statusId = TransactionStatus.Pending;
        const data = await this.prismaService.transaction.create({data: createConsumerDto})
        await this.kafkaProducer.send({
            topic: 'transactions',
            messages: [{key: 'transactions', value: JSON.stringify(data)}]
        });
        const dataTransaction = this.findOne(data.id);
        console.log('TRANSACTION CREATED => ', dataTransaction);
        return dataTransaction
    }

    findAll() {
        return this.prismaService.transaction.findMany({
            include: {
                type: true,
                status: true
            }
        });
    }

    findOne(id: number) {
        return this.prismaService.transaction.findUnique({
            where: {id},
            include: {
                type: true,
                status: true
            }
        })
    }

    async update(id: number, updateConsumerDto: UpdateTransactionDto) {
        await this.prismaService.transaction.update({
            where: {id},
            data: updateConsumerDto
        })
        return this.findOne(id);
    }

    remove(id: number) {
        return `This action removes a #${id} consumer`;
    }
}
