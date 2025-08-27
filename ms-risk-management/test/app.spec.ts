import { FraudAssessmentUseCase } from '../src/application/usecase/fraud/FraudAssessment.usecase';
import { ClientKafka } from '@nestjs/microservices';

describe('FraudAssessmentUseCase', () => {
    let useCase: FraudAssessmentUseCase;
    let kafkaClient: ClientKafka;

    beforeEach(() => {
        kafkaClient = { emit: jest.fn() } as any;
        useCase = new FraudAssessmentUseCase(kafkaClient);
    });

    it('should approve payment when amount is less than or equal to 1000', async () => {
        const dto = { id: '3b6d658c-8da2-4807-808b-8422c25aa6f8', amount: 500, status: 'pending' };
        const result = await useCase.execute(dto as any);
        expect(dto.status).toBe('approved');
        expect(kafkaClient.emit).toHaveBeenCalledWith('fraud_payment_status', dto);
        expect(result).toEqual({ message: `Transaction ${dto.id} status: ${dto.status}` });
    });

    it('should reject payment when amount is greater than 1000', async () => {
        const dto = { id: '3b6d658c-8da2-4807-808b-8422c25aa6f8', amount: 1500, status: 'pending' };
        const result = await useCase.execute(dto as any);
        expect(dto.status).toBe('rejected');
        expect(kafkaClient.emit).toHaveBeenCalledWith('fraud_payment_status', dto);
        expect(result).toEqual({ message: `Transaction ${dto.id} status: ${dto.status}` });
    });

    it('should reject payment when amount is 0', async () => {
        const dto = { amount: 0, status: 'pending' };
        await useCase.execute(dto as any);
        expect(dto.status).toBe('rejected');
    });

    it('should reject payment when amount is negative', async () => {
        const dto = { amount: -100, status: 'pending' };
        await useCase.execute(dto as any);
        expect(dto.status).toBe('rejected');
    });

    it('should call validateAmount with correct amount', async () => {
        const spy = jest.spyOn(useCase, 'validateAmount');
        const dto = { amount: 999, status: 'pending' };
        await useCase.execute(dto as any);
        expect(spy).toHaveBeenCalledWith(999);
    });
});