import {TransactionController} from "@/contexts/transaction/transaction.controller";
import {TransactionService} from "@/contexts/transaction/transaction.service";
import {Test, TestingModule} from "@nestjs/testing";
import {LoggerService} from "@/config/logger/logger.service";
import {TracerService} from "@/config/tracer/tracer.service";
import {headers, transaction, uuidMock} from "../../mocks/transaction";
import {TransactionDto} from "@/contexts/transaction/dto/transaction.dto";


const results = { mock: true, test: 'test', data: { access_token: 'access_token' } };


describe('Transaction', () => {
    let transactionController: TransactionController;
    let transactionService: TransactionService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TransactionService, {
                provide: TransactionService,
                useValue: {
                    create: jest.fn().mockResolvedValue(results.test),
                    find: jest.fn().mockResolvedValue(results.test),
                },
            },],
            controllers: [TransactionController],
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

        transactionController = module.get<TransactionController>(TransactionController);
        transactionService = module.get<TransactionService>(TransactionService);
    });

    it('module should be defined', async () => {
        expect(module).toBeDefined();
    });

    it('controller should be defined', async () => {
        expect(transactionController).toBeDefined();
    });

    it('should post successfully', async () => {
        await transactionController.create(headers, transaction as unknown as TransactionDto);
        expect(transactionService.create).toBeCalled();
    });

    it('should fail to post', async () => {
        jest.spyOn(transactionService, 'create').mockImplementationOnce(() => Promise.reject());
        const response = transactionController.create(headers, transaction as unknown as TransactionDto);
        await expect(response).rejects.toBeFalsy();
    });

    it('should find successfully', async () => {
        let responseObject = {
        };

        const response: Partial<Response> = {
            status: 200,
            json: jest.fn().mockImplementation().mockReturnValue(responseObject),
        }
        await transactionController.find(headers,'1',response);
        expect(transactionService.find).toBeCalled();
    });
});
