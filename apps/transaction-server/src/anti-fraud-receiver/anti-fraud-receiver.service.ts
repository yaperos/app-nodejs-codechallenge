import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache as CacheManager } from 'cache-manager';
@Injectable()
export class AntiFraudReceiverService {

    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: CacheManager,

    ) { }


    private async updateStatus(data: any, statusId: number) {
        const { id } = data;
        console.log('transactionId: ', id);
        let obj = await this.prisma.yapeTransaction.update({
            select: {
                transactionExternalId: true,
                value: true,
                createdAt: true,
                transactionType: {
                    select: {
                        name: true
                    }
                },
                transactionStatus: {
                    select: {
                        name: true
                    }
                }
            },
            where: { transactionExternalId: id },
            data: { transactionStatusId: statusId },
        });
        await this.cacheManager.set(obj.transactionExternalId, obj);
        console.log('obj: ', obj);
    }

    async handleAntiSuccess(data: any) {
        this.updateStatus(data, 2);
    }

    async handleAntiWrong(data: any) {
        this.updateStatus(data, 3);
    }

}

