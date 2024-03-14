import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Transaction, TransactionStatus } from '@prisma/client';
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { ProducerService } from "src/kafka/producer.service";
import { ConsumerService } from "src/kafka/consumer.service";

@Injectable()
export class TransactionService implements OnModuleInit {
    constructor(private prisma: PrismaService, private readonly producerService: ProducerService, private readonly consumerService: ConsumerService) { }

    async onModuleInit() {
        await this.consumerService.consume(
            'antifraud-transaction-status',
            {
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const response = JSON.parse(message.value.toString());
                        const transactionId = response?.transactionId;
                        const status = response?.status;
                        if (!transactionId || !status)
                            throw new BadRequestException('Invalid response from antifraud-transaction-status');
                        await this.updateTransactionStatus(transactionId, status);
                    } catch (error) {
                        console.error('Error updating transaction:', error);
                    }
                }
            }
        )
    }

    async create(transactionData: CreateTransactionInput): Promise<Transaction> {
        try {
            const pendingStatus = await this.getPendingTransactionStatus();
            const transaction = await this.prisma.transaction.create({
                data: {
                    ...transactionData,
                    transactionStatusId: pendingStatus?.id,
                },
                include: { transactionType: true, transactionStatus: true },
            });
            if (!transaction)
                throw new BadRequestException('Failed to create transaction');
            await this.producerService.produce({
                topic: 'transactions',
                messages: [
                    {
                        key: 'transaction-created',
                        value: JSON.stringify(transaction),
                    },
                ],
            })
            return transaction;
        } catch (error) {
            throw new BadRequestException('Failed to create transaction');
        }
    }

    async updateTransactionStatus(id: string, status: string): Promise<Transaction> {
        const statusFound = await this.prisma.transactionStatus.findFirst({ where: { name: status } });
        if (!statusFound)
            throw new NotFoundException('Status not found');

        const existingTransaction = this.getTransactionById(id)
        if (!existingTransaction) throw new NotFoundException('Transaction not found')

        return this.prisma.transaction.update({
            where: { id },
            data: {
                transactionStatusId: statusFound.id,
                updatedAt: new Date(),
            },
        });
    }

    async getPendingTransactionStatus(): Promise<TransactionStatus> {
        const pendingStatuses = await this.prisma.transactionStatus.findMany({ where: { name: 'pending' } });
        if (!pendingStatuses.length)
            throw new NotFoundException('No pending status found');
        return pendingStatuses[0];
    }

    async getTransactionById(id: string): Promise<Transaction> {
        return this.prisma.transaction.findUnique({ where: { id }, include: { transactionType: true, transactionStatus: true } });
    }

    async updateTransaction(id: string, data: Transaction): Promise<Transaction> {
        return this.prisma.transaction.update({ where: { id }, data });
    }

    async getTransactions(): Promise<Transaction[]> {
        return this.prisma.transaction.findMany();
    }

}