import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { TransactionRequestDto, TransactionResponseDto } from "./dto";
import { Prisma } from "@prisma/client";
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
            let pendingStatus = await this.prisma.transactionStatus.findFirst(
                {
                    where: {
                        name: {
                            equals: "pending",
                            mode: "insensitive"
                        }
                    }
                }
            )

            if (!pendingStatus) {
                pendingStatus = await this.prisma.transactionStatus.create({
                    data: {
                        name: "pending"
                    }
                })
            }

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
                            id: pendingStatus.id
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
                value: newTransaction.value,
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
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                externalId: event.transactionExternalId
            }
        })

        if (transaction) {
            const approvedStatus = await this.prisma.transactionStatus.findFirst({
                where: {
                    name: {
                        equals: "approved",
                        mode: "insensitive"
                    }
                }
            })
            await this.prisma.transaction.update({
                where: {
                    externalId: event.transactionExternalId
                },
                data: {
                    statusId: approvedStatus.id
                }
            })
        }
    }

    async handleTransactionRejected(event: TransactionRejectedEvent) {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                externalId: event.transactionExternalId
            }
        })

        if (transaction) {
            const approvedStatus = await this.prisma.transactionStatus.findFirst({
                where: {
                    name: {
                        equals: "rejected",
                        mode: "insensitive"
                    }
                }
            })
            await this.prisma.transaction.update({
                where: {
                    externalId: event.transactionExternalId
                },
                data: {
                    statusId: approvedStatus.id
                }
            })
        }
    }
}