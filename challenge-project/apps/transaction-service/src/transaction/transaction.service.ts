import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { TransactionQueryDto, TransactionRequestDto, TransactionResponseDto } from "./dto";
import { Prisma, Transaction } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TransactionApprovedEvent, TransactionCreatedEvent, TransactionRejectedEvent } from "@app/common/events";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class TransactionService {
    constructor(
        private prisma: PrismaService,
        @Inject("TRANSACTION_SERVICE")
        private readonly kafka: ClientProxy
    ) { }

    async createTransaction(dto: TransactionRequestDto): Promise<TransactionResponseDto> {
        try {

            const newTransaction = await this.prisma.transaction.create({
                data: {
                    accountExternalIdCredit: dto.accountExternalIdCredit,
                    accountExternalIdDebit: dto.accountExternalIdDebit,
                    transactionType: {
                        connect: {
                            id: dto.transferTypeId
                        }
                    },
                    transactionStatus: {
                        connect: {
                            id: 1
                        }
                    },
                    value: dto.value
                },
                include: {
                    transactionStatus: true,
                    transactionType: true
                }
            })

            const responseDto = new TransactionResponseDto(newTransaction);

            const event: TransactionCreatedEvent = {
                transactionExternalId: newTransaction.externalId,
                value: newTransaction.value.toNumber(),
                createdAt: newTransaction.createdAt
            };

            this.kafka.emit('transaction-created', {
                value: event
            })

            return responseDto;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new BadRequestException(`Transfer type with id ${dto.transferTypeId} does not exist.`)
                }
            }
            throw error;
        }
    }

    async getTransactions(query: TransactionQueryDto): Promise<TransactionResponseDto[]> {
        const transactions = await this.prisma.transaction.findMany({
            skip: query.offset,
            take: query.limit,
            include: {
                transactionStatus: true,
                transactionType: true
            }
        });
        const response = transactions.map(transaction => new TransactionResponseDto(transaction));
        return response;
    }

    async getTransactionByExternalId(externalId: string): Promise<TransactionResponseDto> {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                externalId: externalId,
            },
            include: {
                transactionStatus: true,
                transactionType: true
            }
        });

        if (!transaction) {
            throw new NotFoundException(`Transaction with id ${externalId} not found`);
        }

        const responseDto = new TransactionResponseDto(transaction);

        return responseDto;
    }

    async handleTransactionApproved(event: TransactionApprovedEvent) {
        // additional logic...

        await this.updateTransactionStatus(event);
    }

    async handleTransactionRejected(event: TransactionRejectedEvent) {
        // additional logic...

        await this.updateTransactionStatus(event);
    }

    async updateTransactionStatus(event: TransactionApprovedEvent | TransactionRejectedEvent) {
        try {
            const transaction = await this.prisma.transaction.findUnique({
                where: {
                    externalId: event.transactionExternalId
                }
            })

            if (!transaction) return;

            const status = await this.prisma.transactionStatus.findFirst({
                where: {
                    name: {
                        equals: event.status,
                        mode: "insensitive"
                    }
                }
            })

            if (!status) return;

            await this.prisma.transaction.update({
                where: {
                    externalId: event.transactionExternalId
                },
                data: {
                    statusId: status.id
                }
            })
        } catch (ex) {
            Logger.error(ex)
        }
    }
}