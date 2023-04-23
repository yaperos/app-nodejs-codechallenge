import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AntiFraudReceiverService {

    constructor(
        private prisma: PrismaService,
    ) {}

    async handleAntiSuccess(data: any) {
        console.log('AntiFraudReceiverService.handleAntiSuccess');
        const { id } = data;
        console.log('transactionId: ', id);
        let obj = await this.prisma.yapeTransaction.update({
            where: { transactionExternalId: id },
            data: { transactionStatus: 2 },
        });   
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
        console.log('obj: ', obj);
    }

}

