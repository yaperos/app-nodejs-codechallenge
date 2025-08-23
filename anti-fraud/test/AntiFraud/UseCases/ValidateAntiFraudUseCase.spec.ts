import {ValidateAntiFraudUseCase} from "../../../src/AntiFraud/Application/UseCases/ValidateAntiFraudUseCase";
import {MessageStatusModel} from "../../../src/AntiFraud/Domain/Models/MessageStatusModel";
import {VALIDATION_ANTI_FRAUD_STATUS} from "../../../src/AntiFraud/Domain/Constants/CommonConstants";
describe('ValidateAntiFraudUseCase', () => {
    let useCase: ValidateAntiFraudUseCase;
    let mockConsumer: any;
    let mockProducer: any;
    let mockService: any;

    beforeEach(() => {
        mockConsumer = {
            consumer: jest.fn().mockImplementation((callback: () => void) => callback()),
            run: jest.fn(),
        };
        mockProducer = {
            publish: jest.fn(),
        };
        mockService = {
            validate: jest.fn().mockResolvedValue(new MessageStatusModel(
                'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
                VALIDATION_ANTI_FRAUD_STATUS.REJECTED,
                'value_exceeds_limit'
            )),
        };

        useCase = new ValidateAntiFraudUseCase(mockConsumer, mockProducer, mockService);
    });

    it('should execute use case and call consumer subscribe and producer publish', async () => {
        await useCase.execute();

        expect(mockConsumer.consumer).toHaveBeenCalled();
        expect(mockProducer.publish).toHaveBeenCalled();
    });
});
