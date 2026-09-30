import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { type Prisma, PrismaClient } from '@prisma/client';

export type DbClient = PrismaClient | Prisma.TransactionClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}