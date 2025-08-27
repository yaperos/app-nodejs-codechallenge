import { Test, TestingModule } from '@nestjs/testing';
import { SavePaymentUseCase } from '../src/application/usecase/operation/savePayment.usecase';
import { UpdatePaymentUseCase } from '../src/application/usecase/operation/updatePayment.usecase';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../src/domain/entities/payment.entity';
import { User } from '../src/domain/entities/user.entity';
import { TransactionStatus } from '../src/domain/entities/transactionStatus.entity';
import { ClientKafka } from '@nestjs/microservices';
import { Repository } from 'typeorm';

describe('Payment UseCases', () => {
    let savePaymentUseCase: SavePaymentUseCase;
    let updatePaymentUseCase: UpdatePaymentUseCase;
    let paymentRepo: Repository<Payment>;
    let userRepo: Repository<User>;
    let transactionStatusRepo: Repository<TransactionStatus>;
    let kafkaClient: ClientKafka;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SavePaymentUseCase,
                UpdatePaymentUseCase,
                {
                    provide: getRepositoryToken(Payment),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(TransactionStatus),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: 'KAFKA_SERVICE',
                    useValue: { emit: jest.fn() },
                },
            ],
        }).compile();

        savePaymentUseCase = module.get(SavePaymentUseCase);
        updatePaymentUseCase = module.get(UpdatePaymentUseCase);
        paymentRepo = module.get(getRepositoryToken(Payment));
        userRepo = module.get(getRepositoryToken(User));
        transactionStatusRepo = module.get(getRepositoryToken(TransactionStatus));
        kafkaClient = module.get('KAFKA_SERVICE');
    });

    it('should return "User not found" if user does not exist', async () => {
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
        const result = await savePaymentUseCase.execute({
            email: 'notfound@email.com',
            accountExternalIdDebit: 'debit-id',
            accountExternalIdCredit: 'credit-id',
            tranferTypeId: 1,
            value: 100,
        });
        expect(result).toEqual({ message: 'User not found' });
    });

    it('should save payment and emit to kafka', async () => {
        const user = { id: '1', name: 'Juan', email: 'juan@diaz.com' } as User;
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
        jest.spyOn(paymentRepo, 'create').mockReturnValue({
            user,
            accountExternalIdDebit: 'debit-id',
            accountExternalIdCredit: 'credit-id',
            tranferTypeId: 1,
            value: 100,
        } as Payment);
        jest.spyOn(paymentRepo, 'save').mockResolvedValue({
            id: 'payment-id',
            user,
            accountExternalIdDebit: 'debit-id',
            accountExternalIdCredit: 'credit-id',
            tranferTypeId: 1,
            value: 100,
            transactionStatuses: [],
        } as Payment);

        jest.spyOn(transactionStatusRepo, 'create').mockReturnValue({
            name: 'pending',
            payment: { id: 'payment-id' } as Payment,
        } as TransactionStatus);
        jest.spyOn(transactionStatusRepo, 'save').mockResolvedValue({
            name: 'pending',
            payment: { id: 'payment-id' } as Payment,
        } as TransactionStatus);

        const emitSpy = jest.spyOn(kafkaClient, 'emit');
        const result = await savePaymentUseCase.execute({
            email: 'juan@diaz.com',
            accountExternalIdDebit: 'debit-id',
            accountExternalIdCredit: 'credit-id',
            tranferTypeId: 1,
            value: 100,
        });

    expect(result).toEqual({ message: 'Pending Payment: payment-id' });
        expect(emitSpy).toHaveBeenCalledWith('new_payment', {
            id: 'payment-id',
            amount: 100,
            status: 'pending',
        });
    });

    it('should throw error if payment not found on update', async () => {
        jest.spyOn(paymentRepo, 'findOne').mockResolvedValue(null);
        await expect(
            updatePaymentUseCase.execute({
                id: 'notfound',
                email: 'juan@diaz.com',
                accountExternalIdDebit: 'debit-id',
                accountExternalIdCredit: 'credit-id',
                tranferTypeId: 1,
                value: 100,
                status: 'approved',
            }),
        ).rejects.toThrow('Payment not found');
    });

    it('should update payment status', async () => {
        const payment = {
            id: 'payment-id',
            transactionStatuses: [],
        } as any;
        jest.spyOn(paymentRepo, 'findOne').mockResolvedValue(payment);
        jest.spyOn(transactionStatusRepo, 'create').mockReturnValue({
            name: 'approved',
            payment,
        } as TransactionStatus);
        jest.spyOn(transactionStatusRepo, 'save').mockResolvedValue({
            name: 'approved',
            payment,
        } as TransactionStatus);
        jest.spyOn(paymentRepo, 'save').mockResolvedValue(payment);

        await updatePaymentUseCase.execute({
            id: 'payment-id',
            email: 'juan@diaz.com',
            accountExternalIdDebit: 'debit-id',
            accountExternalIdCredit: 'credit-id',
            tranferTypeId: 1,
            value: 100,
            status: 'approved',
        });

        expect(payment.transactionStatuses[payment.transactionStatuses.length - 1].name).toBe('approved');
    });

    it('should call paymentRepository.save when updating payment', async () => {
        const payment = {
            id: 'payment-id',
            transactionStatuses: [],
        } as any;
        jest.spyOn(paymentRepo, 'findOne').mockResolvedValue(payment);
        jest.spyOn(transactionStatusRepo, 'create').mockReturnValue({
            name: 'approved',
            payment,
        } as TransactionStatus);
        jest.spyOn(transactionStatusRepo, 'save').mockResolvedValue({
            name: 'approved',
            payment,
        } as TransactionStatus);
        const saveSpy = jest.spyOn(paymentRepo, 'save').mockResolvedValue(payment);

        await updatePaymentUseCase.execute({
            id: 'payment-id',
            email: 'juan@diaz.com',
            accountExternalIdDebit: 'debit-id',
            accountExternalIdCredit: 'credit-id',
            tranferTypeId: 1,
            value: 100,
            status: 'approved',
        });

        expect(saveSpy).toHaveBeenCalledWith(payment);
    });
});