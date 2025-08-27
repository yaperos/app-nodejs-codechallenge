import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentDto } from "src/application/dto/paymentDto.dto";
import { Payment } from "src/domain/entities/payment.entity";
import { TransactionStatus } from "src/domain/entities/transactionStatus.entity";
import { Repository } from 'typeorm';

@Injectable()
export class UpdatePaymentUseCase {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(TransactionStatus)
        private readonly transactionStatusRepository: Repository<TransactionStatus>,
    ) { }

    async execute(paymentDto: PaymentDto) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentDto.id },
            relations: ['transactionStatuses'],
        });

        if (!payment) {
            console.log(`Warning: payment not found: ${JSON.stringify(paymentDto)}`);
            throw new Error('Payment not found');
        }
        if (!paymentDto.status) {
            console.log(`Warning: invalid status: ${JSON.stringify(paymentDto)}`);
            throw new Error(`Invalid payment status`);
        }
        const newStatus = this.transactionStatusRepository.create({
            name: paymentDto.status,
            payment: payment,
        });
        console.log({ newStatus })

        await this.transactionStatusRepository.save(newStatus);

        payment.transactionStatuses.push(newStatus);

        await this.paymentRepository.save(payment);
    }
}