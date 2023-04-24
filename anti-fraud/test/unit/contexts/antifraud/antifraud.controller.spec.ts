
import {Test, TestingModule} from "@nestjs/testing";

import {headers, transaction, uuidMock} from "../../mocks/transaction";
import {KafkaContext} from "@nestjs/microservices";
import {AntifraudController} from "../../../../src/contexts/antifraud/antifraud.controller";
import {HeadersDto} from "../../../../src/contexts/antifraud/dto/headers.dto";
import {AntifraudService} from "../../../../src/contexts/antifraud/antifraud.service";
import {LoggerService} from "../../../../src/config/logger/logger.service";
import {TracerService} from "../../../../src/config/tracer/tracer.service";

const results = { mock: true, test: 'test', data: { access_token: 'access_token' } };
const context = {
    getMessage: jest.fn(()=>(({headers: HeadersDto, value:transaction})))
};

//{headers: HeadersDto, value: transaction}

describe('antiFraud', () => {
    let antiFraudController: AntifraudController;
    let antiFraudService: AntifraudService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AntifraudService, {
                provide: AntifraudService,
                useValue: { create: jest.fn().mockResolvedValue(results.test) },
            },],
            controllers: [AntifraudController],
        })
            .useMocker((token) => {
                if (token === LoggerService) {
                    return {
                        log: jest.fn().mockResolvedValue(results),
                        error: jest.fn().mockResolvedValue(results),
                    };
                }
                if (token === TracerService) {
                    return { getTrace: jest.fn().mockResolvedValue(uuidMock) };
                }
            })
            .compile();

        antiFraudController = module.get<AntifraudController>(AntifraudController);
        antiFraudService = module.get<AntifraudService>(AntifraudService);
    });

    it('module should be defined', async () => {
        expect(module).toBeDefined();
    });

    it('controller should be defined', async () => {
        expect(antiFraudController).toBeDefined();
    });

    it('should post successfully', async () => {

        await antiFraudController.post(context as unknown as KafkaContext);
        expect(antiFraudService.create).toBeCalled();
    });

    it('should fail to post', async () => {
        jest.spyOn(antiFraudService, 'create').mockImplementationOnce(() => Promise.reject());

        const response = antiFraudController.post(context as unknown as KafkaContext);
        await expect(response).resolves.toBeFalsy();
    });
});
