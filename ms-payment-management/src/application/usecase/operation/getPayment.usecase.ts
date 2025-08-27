import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "src/domain/entities/payment.entity";
import { Repository } from "typeorm";

@Injectable()
export class GetPaymentUseCase {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) { }

    async execute(id: string): Promise<any> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['transactionStatuses'],
        });

        if (!payment) {
            return { message: 'Payment not found' };
        }

        return {
            transactionExternalId: payment.id,
            transactionType: {
                name: payment.tranferTypeId,
            },
            transactionStatus: {
                name: payment.transactionStatuses?.[payment.transactionStatuses.length - 1]?.name ?? null,
            },
            value: payment.value,
            createdAt: payment.created_at,
        };
    }
}