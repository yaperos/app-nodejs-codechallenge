import { Test } from '@nestjs/testing';

import { HealthCheckController } from '../../../../src/apps/transactions-ms/controllers/health-check.controller';
import { HealthCheckUseCase } from '../../../../src/contexts/transactions-ms/transaction/application/health-check/health-check.usecase';

const healthCheckUseCase = {
    validate: jest.fn(),
};

describe('HealthCheckController', () => {
    let healthCheckController: HealthCheckController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [HealthCheckController],
            providers: [
                {
                    provide: HealthCheckUseCase,
                    useValue: healthCheckUseCase,
                },
            ],
        }).compile();
        healthCheckController = await module.resolve<HealthCheckController>(
            HealthCheckController,
        );
        jest.clearAllMocks();
    });

    it('should be define', () => {
        expect(healthCheckController).toBeDefined();
    });

    it('should return OK message', () => {
        healthCheckUseCase.validate.mockReturnValue('OK');

        const response = healthCheckController.validate();

        expect(response).toEqual('OK');
    });
});
