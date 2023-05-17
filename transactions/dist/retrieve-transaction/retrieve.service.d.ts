import { PrismaService } from 'src/prisma/prisma.service';
import { ITransaction } from 'src/transaction/dto/create-anti-fraud-service.dto';
export declare class RetriveService {
    private prisma;
    constructor(prisma: PrismaService);
    updateTransition(transaction: ITransaction): Promise<import(".prisma/client").Transaction>;
}
