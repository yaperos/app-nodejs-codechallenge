import {TransactionService} from "@/contexts/transaction/transaction.service";
import {KafkaService} from "@/config/bus/kafka/kafka.service";
import {Test, TestingModule} from "@nestjs/testing";
import {LoggerService} from "@/config/logger/logger.service";
import {TracerService} from "@/config/tracer/tracer.service";
import { headers, insertedDataMock, transaction, uuidMock} from "../../mocks/transaction";
import {TransactionDto} from "@/contexts/transaction/dto/transaction.dto";
import {InternalServerErrorException} from "@nestjs/common";
import {TransactionRepository} from "@/contexts/transaction/transaction.repository";

const results = { mock: true };

describe('Transaction service', () => {
    let service: TransactionService;
    let kafkaService: KafkaService;
    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                TransactionService,
                {
                    provide: TransactionRepository,
                    useValue: {
                        insertData: jest.fn().mockResolvedValue(insertedDataMock),
                        findData: jest.fn().mockResolvedValue([insertedDataMock])
                    },
                },
            ],
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
                if (token === KafkaService) {
                    return { emit: jest.fn().mockResolvedValue(results) };
                }
            })
            .compile();

        service = module.get<TransactionService>(TransactionService);
        kafkaService = module.get<KafkaService>(KafkaService);

        expect(module).toBeDefined();
        expect(module.get(TransactionService)).toBeInstanceOf(TransactionService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should publish successfully', async () => {
        const response = await service.create(transaction as unknown as TransactionDto, headers);
        expect(response).toBeTruthy();
    });

    it('should fail to publish', async () => {
        jest
            .spyOn(kafkaService, 'emit')
            .mockRejectedValueOnce({ message: 'TimeOut Connection' });
        await expect(
            service.create(transaction as unknown as TransactionDto, headers),
        ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should find successfully', async () => {
        const responses: any  = {
            status: jest.fn().mockReturnValue({
                json: jest.fn().mockReturnValue(results),
            }),
        }
        const response = await service.find('a', responses);
        expect(response).toBeTruthy();
    });
});
