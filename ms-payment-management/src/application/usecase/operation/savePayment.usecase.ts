import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment, User } from "src/domain/entities";
import { TransactionStatus } from "src/domain/entities/transactionStatus.entity";
import { Repository } from 'typeorm';
import { PaymentDto } from 'src/application/dto/paymentDto.dto';

@Injectable()
export class SavePaymentUseCase {
    constructor(
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(TransactionStatus)
        private readonly transactionStatusRepository: Repository<TransactionStatus>,
    ) { }

    async execute(createPaymentDto: PaymentDto) {
        const user = await this.userRepository.findOne({ where: { email: createPaymentDto.email } });
        if (!user) {
            return { message: 'User not found' };
        }

        const duplicatePayment = await this.paymentRepository.findOne({
            where: {
                user: { id: user.id },
                accountExternalIdDebit: createPaymentDto.accountExternalIdDebit,
                accountExternalIdCredit: createPaymentDto.accountExternalIdCredit,
                tranferTypeId: createPaymentDto.tranferTypeId,
                value: createPaymentDto.value,
                transactionStatuses: [{ name: 'pending' }],
            },
            order: { created_at: 'DESC' },
        });

        if (
            duplicatePayment &&
            duplicatePayment.created_at &&
            (Date.now() - new Date(duplicatePayment.created_at).getTime()) < 10000
        ) {
            return { message: 'Duplicate payment detected. Please wait 10 seconds before retrying.' };
        }

        const payment = this.paymentRepository.create({
            user,
            accountExternalIdDebit: createPaymentDto.accountExternalIdDebit,
            accountExternalIdCredit: createPaymentDto.accountExternalIdCredit,
            tranferTypeId: createPaymentDto.tranferTypeId,
            value: createPaymentDto.value,
        });
        const savedPayment = await this.paymentRepository.save(payment);

        const status = this.transactionStatusRepository.create({
            name: 'pending',
            payment: savedPayment,
        });
        await this.transactionStatusRepository.save(status);

        this.kafkaClient.emit('new_payment', {
            id: savedPayment.id,
            amount: createPaymentDto.value,
            status: 'pending',
        });
        return { message: `Pending Payment: ${savedPayment.id}` };
    }
}