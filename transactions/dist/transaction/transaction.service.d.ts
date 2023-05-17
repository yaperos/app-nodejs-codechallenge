import { CreateTransactionInput } from './dto/create-transaction.input';
import { Transaction } from './entities/transaction.entity';
import { PrismaService } from '../prisma/prisma.service';
import { ClientKafka } from '@nestjs/microservices';
export declare class TransactionService {
    private prisma;
    private readonly client;
    constructor(prisma: PrismaService, client: ClientKafka);
    create(createTransactionInput: CreateTransactionInput): Promise<Transaction | null>;
    getById(id: string): Promise<Transaction>;
}
