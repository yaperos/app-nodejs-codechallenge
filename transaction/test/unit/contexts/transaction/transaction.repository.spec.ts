import {TypeOrmModule, TypeOrmOptionsFactory} from "@nestjs/typeorm";
import {TransactionRepository} from "@/contexts/transaction/transaction.repository";
import {Test, TestingModule} from "@nestjs/testing";
import {DataSource} from "typeorm";
import {LoggerService} from "@/config/logger/logger.service";
import {TracerService} from "@/config/tracer/tracer.service";
import {transaction, uuidMock} from "../../mocks/transaction";
import {TransactionDto} from "@/contexts/transaction/dto/transaction.dto";
import {Transaction} from "@/contexts/transaction/entities/transaction.entity";

const results = { mock: true };

const queryRunnerMock = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn().mockResolvedValue('test'),
    commitTransaction: jest.fn().mockResolvedValue('nose'),
    manager: {
        connection: { query: jest.fn().mockResolvedValue([0, 'OK']) },
        save: jest.fn().mockResolvedValue([0, 'OK']),
        findBy: jest.fn().mockResolvedValue([0, 'OK']),
        update: jest.fn().mockResolvedValue([0, 'OK']),
    },
};

const queryRunnerErrorMock = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn().mockResolvedValue('test'),
    commitTransaction: jest.fn().mockResolvedValue('nose'),
    manager: {
        connection: { query: jest.fn().mockResolvedValue([0, 'OK']) },
        save: jest.fn().mockRejectedValue([0, 'Error']),
    },
};

const dataSourceMock = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
};
let dataSourceFactory = jest.fn().mockResolvedValue(dataSourceMock);

class TypeOrmOptionsMock implements TypeOrmOptionsFactory {
    constructor() {}

    async createTypeOrmOptions(connectionName?: string) {
        return {};
    }
}

describe('Testing Transaction Repository class functionality', () => {
    let transactionRepository: TransactionRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    name: 'DB_SERVER_POSTGRES',
                    useClass: TypeOrmOptionsMock,
                    dataSourceFactory: dataSourceFactory,
                }),
            ],
            providers: [
                { provide: DataSource, useValue: dataSourceFactory },
                TransactionRepository,
            ],
        })
            .useMocker((token) => {
                if (token === LoggerService) {
                    return {
                        log: jest.fn().mockReturnValue(results),
                        error: jest.fn().mockReturnValue(results),
                    };
                }
                if (token === TracerService) {
                    return { getTrace: jest.fn().mockReturnValue(uuidMock) };
                }
            })
            .compile();

        transactionRepository = module.get<TransactionRepository>(TransactionRepository);
    });

    it('should insert data successfully', async () => {
        const response = await transactionRepository.insertData(
            transaction as unknown as Transaction,
        );
        expect(response).toEqual([0, 'OK']);
    });

    it('should find data successfully', async () => {
        const response = await transactionRepository.findData('a');
        expect(response).toEqual([0, 'OK']);
    });

    it('should update data successfully', async () => {
        const response = await transactionRepository.updateData('a','approved');
        expect(response).toEqual([0, 'OK']);
    });

    it('should fail on saving data', async () => {
        dataSourceMock.createQueryRunner.mockReturnValue(queryRunnerErrorMock);
        await expect(
            transactionRepository.insertData(transaction as unknown as Transaction),
        ).rejects.toStrictEqual([0, 'Error']);
    });


});
