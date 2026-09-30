import { Inject, Injectable } from '@nestjs/common';
import { ProcessedMessageRepositoryPort } from '../../../domain/ports/processed-message.repository.port';
import { type DbClient, PrismaService } from './prisma.service';

@Injectable()
export class PrismaProcessedMessageRepository extends ProcessedMessageRepositoryPort {

    constructor(@Inject(PrismaService) private readonly db: DbClient) {
        super();
    }

    async markProcessed(consumer: string, messageId: string): Promise<boolean> {
        const result = await this.db.processedMessage.createMany({
            data: [{ consumer, messageId }],
            skipDuplicates: true,
        });
        return result.count === 1;
    }
}