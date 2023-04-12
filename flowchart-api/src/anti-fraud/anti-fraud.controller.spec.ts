import { Test } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';

describe('AntiFraudController', () => {
    let antiFraudController: AntiFraudController;
    let antiFraudService: AntiFraudService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AntiFraudController],
            providers: [
                {
                    provide: AntiFraudService,
                    useValue: {
                        manageTransaction: jest.fn(),
                    },
                },
            ],
        }).compile();

        antiFraudController = moduleRef.get<AntiFraudController>(
            AntiFraudController,
        );
        antiFraudService = moduleRef.get<AntiFraudService>(AntiFraudService);
    });

    describe('consumer', () => {
        it('should call antiFraudService with the message payload', async () => {
            const messagePayload = {
                value: 1000,

            };
            await antiFraudController.consumer(messagePayload);
            expect(antiFraudService.manageTransaction).toHaveBeenCalledWith(
                messagePayload,
            );
        });
    });
});
