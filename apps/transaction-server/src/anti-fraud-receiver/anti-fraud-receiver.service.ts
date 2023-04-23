import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache as CacheManager } from 'cache-manager';
@Injectable()
export class AntiFraudReceiverService {

    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: CacheManager
    ) {}

    async handleAntiSuccess(data: any) {
        console.log('AntiFraudReceiverService.handleAntiSuccess');
        const { id } = data;
        console.log('transactionId: ', id);
        let obj = await this.prisma.yapeTransaction.update({
            where: { transactionExternalId: id },
            data: { transactionStatus: 2 },
        });
        await this.cacheManager.set(obj.transactionExternalId, obj);   
        console.log('obj: ', obj);
        
    }

    async handleAntiWrong(data: any) {
        console.log('AntiFraudReceiverService.handleAntiWrong');
        const { id } = data;
        console.log('transactionId: ', id);
        let obj = await  this.prisma.yapeTransaction.update({
            where: { transactionExternalId: id },
            data: { transactionStatus: 3 },
        });
        await this.cacheManager.set(obj.transactionExternalId, obj);   
        console.log('obj: ', obj);
    }

}

